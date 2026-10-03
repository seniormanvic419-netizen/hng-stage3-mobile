import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, AppState, FlatList, Image, Platform, Pressable, RefreshControl, SafeAreaView, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { supabase, WEB_ORIGIN, AUTH_REDIRECT } from './src/supabase';
import { naira, shortId } from './src/money';

WebBrowser.maybeCompleteAuthSession();

const C = {
  bg: '#f7f6f2', surface: '#ffffff', surface2: '#f0eee7', text: '#1a1c1a', text2: '#585c57', muted: '#8a8e88',
  line: '#e4e2da', green: '#1b5e3b', greenSoft: 'rgba(27,94,59,0.10)', danger: '#b4232c',
};

/* ---------------- auth: Google via Supabase, PKCE, returns to basira://auth/callback ---------------- */
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: AUTH_REDIRECT, skipBrowserRedirect: true, queryParams: { prompt: 'select_account' } },
  });
  if (error) throw error;
  const result = await WebBrowser.openAuthSessionAsync(data.url, AUTH_REDIRECT);
  if (result.type !== 'success') return null;
  const url = new URL(result.url);
  const code = url.searchParams.get('code');
  const err = url.searchParams.get('error_description') || url.searchParams.get('error');
  if (err) throw new Error(err);
  if (!code) throw new Error('No code returned from Google');
  const { data: s, error: e2 } = await supabase.auth.exchangeCodeForSession(code);
  if (e2) throw e2;
  return s.session;
}

/* ---------------- app ---------------- */
export default function App() {
  const [session, setSession] = useState(null);
  const [booted, setBooted] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});           // { productId: qty } mirrors cart_items for this user
  const [orders, setOrders] = useState(null);
  const [tab, setTab] = useState('shop');          // shop | cart | orders | checkout | thanks
  const [busy, setBusy] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [emailNote, setEmailNote] = useState('');
  const [category, setCategory] = useState('All');
  const [live, setLive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => { setRefreshing(true); await Promise.all([loadCart(), loadOrders()]); setRefreshing(false); };
  const channelRef = useRef(null);
  const user = session?.user || null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setBooted(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase.from('products').select('*').eq('in_stock', true).order('sort').then(({ data, error }) => {
      if (error) Alert.alert('Could not load products', error.message); else setProducts(data || []);
    });
  }, []);

  const loadCart = useCallback(async () => {
    if (!user) { setCart({}); return; }
    const { data, error } = await supabase.from('cart_items').select('product_id, quantity');
    if (error) { Alert.alert('Cart', error.message); return; }
    const next = {}; (data || []).forEach((r) => { next[r.product_id] = r.quantity; });
    setCart(next);
  }, [user?.id]);

  const loadOrders = useCallback(async () => {
    if (!user) { setOrders(null); return; }
    const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (error) Alert.alert('Orders', error.message); else setOrders(data || []);
  }, [user?.id]);

  // Refetch whenever the app returns to the foreground (belt and braces next to realtime).
  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => { if (st === 'active') { loadCart(); } });
    return () => sub.remove();
  }, [loadCart]);

  // Cart: load once, then follow the same table the website writes to, in realtime.
  useEffect(() => {
    if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null; setLive(false); }
    if (!user) { setCart({}); setOrders(null); return; }
    if (session?.access_token) supabase.realtime.setAuth(session.access_token);
    loadCart(); loadOrders();
    channelRef.current = supabase
      .channel('cart:' + user.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cart_items', filter: 'user_id=eq.' + user.id }, () => loadCart())
      .subscribe((status) => setLive(status === 'SUBSCRIBED'));
    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [user?.id]);

  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const lines = useMemo(() => Object.keys(cart).map((id) => (byId[id] ? { product: byId[id], qty: cart[id] } : null)).filter(Boolean), [cart, byId]);
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  async function setQty(productId, qty) {
    if (!user) { await doSignIn(); return; }
    const next = { ...cart }; if (qty <= 0) delete next[productId]; else next[productId] = Math.min(99, qty);
    setCart(next);
    const q = qty > 0
      ? supabase.from('cart_items').upsert({ user_id: user.id, product_id: productId, quantity: Math.min(99, qty), updated_at: new Date().toISOString() }, { onConflict: 'user_id,product_id' })
      : supabase.from('cart_items').delete().match({ user_id: user.id, product_id: productId });
    const { error } = await q;
    if (error) { Alert.alert('Cart sync failed', error.message); loadCart(); }
  }

  async function doSignIn() {
    try { setBusy(true); await signInWithGoogle(); }
    catch (e) { Alert.alert('Sign-in failed', e.message); }
    finally { setBusy(false); }
  }
  async function doSignOut() { await supabase.auth.signOut(); setTab('shop'); }

  async function placeOrder(form) {
    if (!lines.length) return;
    setBusy(true);
    try {
      const order = { user_id: user.id, email: form.email.trim(), customer_name: form.name.trim(), address: form.address.trim() + (form.phone ? '\nPhone: ' + form.phone.trim() : ''), total, status: 'confirmed' };
      const { data: created, error } = await supabase.from('orders').insert(order).select().single();
      if (error) throw error;
      const items = lines.map((l) => ({ order_id: created.id, product_id: l.product.id, name: l.product.name, unit_price: l.product.price, quantity: l.qty }));
      const { error: e2 } = await supabase.from('order_items').insert(items);
      if (e2) throw e2;
      await supabase.from('cart_items').delete().eq('user_id', user.id);
      setCart({}); setLastOrder({ ...created, order_items: items }); setTab('thanks'); setEmailNote('Sending your confirmation email…');
      const { data: s } = await supabase.auth.getSession();
      const res = await fetch(WEB_ORIGIN + '/api/send-confirmation', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.session.access_token },
        body: JSON.stringify({ orderId: created.id }),
      });
      const r = await res.json().catch(() => ({}));
      setEmailNote(r.sent ? 'A confirmation email is on its way to ' + order.email + '. Check Spam if you do not see it.' : 'Your order is saved. Email: ' + (r.reason || r.error || 'not sent'));
      loadOrders();
    } catch (e) { Alert.alert('Could not place the order', e.message); }
    finally { setBusy(false); }
  }

  if (!booted) return <View style={[s.center, { flex: 1, backgroundColor: C.bg }]}><ActivityIndicator color={C.green} /></View>;

  return (
    <SafeAreaView style={s.app}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={s.top}>
        <Pressable onPress={() => setTab('shop')} style={s.brand}>
          <View style={s.mark}><Text style={s.markText}>B</Text></View>
          <Text style={s.brandText}>Basira <Text style={{ color: C.green }}>Provisions</Text></Text>
        </Pressable>
        {user ? (
          <Pressable onPress={doSignOut} style={s.pill}><Text style={s.pillText}>Log out</Text></Pressable>
        ) : (
          <Pressable onPress={doSignIn} style={s.pill} disabled={busy}>
            <Text style={s.pillText}>{busy ? 'Opening Google…' : 'Sign in with Google'}</Text>
          </Pressable>
        )}
      </View>

      {tab === 'shop' && (
        <FlatList
          data={products.filter((p) => category === 'All' || p.category === category)}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 96 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[C.green]} tintColor={C.green} />}
          ListHeaderComponent={
            <View style={{ gap: 12 }}>
              <View>
                <Text style={s.eyebrow}>OJODU BERGER, LAGOS · MON TO SAT</Text>
                <Text style={s.h1}>Everyday essentials from the shop on your street.</Text>
                {user
                  ? <Text style={s.lede}>Hi {(user.user_metadata?.full_name || user.email || '').split(' ')[0]}. Your cart is shared with the website.</Text>
                  : <Text style={s.lede}>Sign in with Google to use the same cart and orders as on the website.</Text>}
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {categories.map((c) => (
                  <Pressable key={c} onPress={() => setCategory(c)} style={[s.chip, category === c && s.chipOn]}>
                    <Text style={[s.chipText, category === c && { color: C.text }]}>{c}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          }
          renderItem={({ item: p }) => (
            <View style={s.card}>
              <Image source={{ uri: WEB_ORIGIN + '/img/' + p.id + '.jpg' }} style={s.cardImg} />
              <View style={{ padding: 10, gap: 4, flex: 1 }}>
                <Text style={s.cat}>{p.category}</Text>
                <Text style={s.name} numberOfLines={2}>{p.name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <Text style={s.price}>{naira(p.price)}</Text>
                  {cart[p.id]
                    ? <Qty value={cart[p.id]} onChange={(q) => setQty(p.id, q)} />
                    : <Pressable onPress={() => setQty(p.id, 1)} style={s.add}><Text style={s.addText}>Add</Text></Pressable>}
                </View>
              </View>
            </View>
          )}
        />
      )}

      {tab === 'cart' && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 96 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[C.green]} tintColor={C.green} />}>
          <Text style={s.h1}>Your cart</Text>
          {!user && <Text style={s.lede}>Sign in to see the cart you built on the website.</Text>}
          {user && !lines.length && <Text style={s.lede}>Your cart is empty. Add something from the shop, here or on the website.</Text>}
          {lines.map((l) => (
            <View key={l.product.id} style={s.line}>
              <Image source={{ uri: WEB_ORIGIN + '/img/' + l.product.id + '.jpg' }} style={s.lineImg} />
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={s.name}>{l.product.name}</Text>
                <Qty value={l.qty} onChange={(q) => setQty(l.product.id, q)} />
              </View>
              <Text style={s.price}>{naira(l.product.price * l.qty)}</Text>
            </View>
          ))}
          {lines.length > 0 && (
            <View style={s.totalRow}><Text style={s.totalLabel}>Total</Text><Text style={s.totalValue}>{naira(total)}</Text></View>
          )}
          {lines.length > 0 && (
            <Pressable onPress={() => setTab('checkout')} style={s.primary}><Text style={s.primaryText}>Checkout</Text></Pressable>
          )}
          {user && <Text style={s.hint}>{live ? '● Live: changes made on the website appear here instantly.' : 'Live updates connecting… pull down to refresh.'}</Text>}
        </ScrollView>
      )}

      {tab === 'checkout' && <Checkout user={user} lines={lines} total={total} busy={busy} onBack={() => setTab('cart')} onSubmit={placeOrder} />}

      {tab === 'thanks' && lastOrder && (
        <ScrollView contentContainerStyle={{ padding: 24, gap: 12, alignItems: 'center', paddingTop: 48 }}>
          <View style={s.check}><Text style={{ color: '#fff', fontSize: 28, fontWeight: '800' }}>✓</Text></View>
          <Text style={s.h1}>Order received</Text>
          <Text style={[s.lede, { textAlign: 'center' }]}>Order {shortId(lastOrder.id)} for {naira(lastOrder.total)} is confirmed. Pay at the door.</Text>
          <Text style={[s.hint, { textAlign: 'center' }]}>{emailNote}</Text>
          <Pressable onPress={() => { loadOrders(); setTab('orders'); }} style={s.primary}><Text style={s.primaryText}>View my orders</Text></Pressable>
          <Pressable onPress={() => setTab('shop')} style={s.pill}><Text style={s.pillText}>Keep shopping</Text></Pressable>
        </ScrollView>
      )}

      {tab === 'orders' && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 96 }}>
          <Text style={s.h1}>My orders</Text>
          {!user && <Pressable onPress={doSignIn} style={s.primary}><Text style={s.primaryText}>Sign in to see your orders</Text></Pressable>}
          {user && orders === null && <ActivityIndicator color={C.green} />}
          {user && orders && !orders.length && <Text style={s.lede}>No orders yet.</Text>}
          {(orders || []).map((o) => (
            <View key={o.id} style={s.order}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={s.name}>Order {shortId(o.id)}</Text>
                <View style={s.badge}><Text style={s.badgeText}>{o.status}{o.email_sent ? ' · email sent' : ''}</Text></View>
              </View>
              <Text style={s.hint}>{new Date(o.created_at).toLocaleString()}</Text>
              {(o.order_items || []).map((it) => <Text key={it.id || it.name} style={s.lede}>{it.quantity} × {it.name} — {naira(it.unit_price * it.quantity)}</Text>)}
              <View style={[s.totalRow, { marginTop: 4 }]}><Text style={s.hint}>{(o.address || '').split('\n')[0]}</Text><Text style={s.totalValue}>{naira(o.total)}</Text></View>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={s.tabs}>
        {[['shop', 'Shop'], ['cart', count ? `Cart (${count})` : 'Cart'], ['orders', 'Orders']].map(([k, label]) => (
          <Pressable key={k} onPress={() => { if (k === 'orders') loadOrders(); if (k === 'cart') loadCart(); setTab(k); }} style={[s.tab, tab === k && s.tabOn]}>
            <Text style={[s.tabText, tab === k && { color: C.green }]}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function Qty({ value, onChange }) {
  return (
    <View style={s.qty}>
      <Pressable onPress={() => onChange(value - 1)} style={s.qtyBtn} hitSlop={6}><Text style={s.qtyText}>−</Text></Pressable>
      <Text style={[s.qtyText, { minWidth: 22, textAlign: 'center' }]}>{value}</Text>
      <Pressable onPress={() => onChange(value + 1)} style={s.qtyBtn} hitSlop={6}><Text style={s.qtyText}>+</Text></Pressable>
    </View>
  );
}

function Checkout({ user, lines, total, busy, onBack, onSubmit }) {
  const meta = user?.user_metadata || {};
  const [form, setForm] = useState({ name: meta.full_name || meta.name || '', email: user?.email || '', address: '', phone: '' });
  const ok = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.address.trim() && lines.length;
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 96 }} keyboardShouldPersistTaps="handled">
      <Text style={s.h1}>Checkout</Text>
      <Text style={s.lede}>Payment on delivery. We email a confirmation the moment the order is in.</Text>
      <Field label="Full name" value={form.name} onChangeText={set('name')} />
      <Field label="Email for confirmation" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" />
      <Field label="Delivery address" value={form.address} onChangeText={set('address')} multiline placeholder="House number, street, area, landmark" />
      <Field label="Phone (optional)" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
      <View style={s.summary}>
        {lines.map((l) => <Text key={l.product.id} style={s.lede}>{l.qty} × {l.product.name} — {naira(l.product.price * l.qty)}</Text>)}
        <View style={s.totalRow}><Text style={s.totalLabel}>Total</Text><Text style={s.totalValue}>{naira(total)}</Text></View>
      </View>
      <Pressable onPress={() => onSubmit(form)} disabled={!ok || busy} style={[s.primary, (!ok || busy) && { opacity: 0.5 }]}>
        <Text style={s.primaryText}>{busy ? 'Placing order…' : 'Place order'}</Text>
      </Pressable>
      <Pressable onPress={onBack} style={s.pill}><Text style={s.pillText}>Back to cart</Text></Pressable>
    </ScrollView>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput {...props} style={[s.input, props.multiline && { minHeight: 80, textAlignVertical: 'top', paddingTop: 10 }]} placeholderTextColor={C.muted} />
    </View>
  );
}

const s = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? 28 : 0 },
  center: { alignItems: 'center', justifyContent: 'center' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56, borderBottomWidth: 1, borderColor: C.line, backgroundColor: C.bg },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: { width: 30, height: 30, borderRadius: 8, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  markText: { color: '#fff', fontWeight: '800' },
  brandText: { fontSize: 17, fontWeight: '700', color: C.text },
  pill: { paddingHorizontal: 14, height: 38, borderRadius: 999, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface },
  pillText: { fontWeight: '600', color: C.text },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: C.green, marginBottom: 6 },
  h1: { fontSize: 26, fontWeight: '800', color: C.text, letterSpacing: -0.5, lineHeight: 30 },
  lede: { color: C.text2, fontSize: 15, lineHeight: 21, marginTop: 4 },
  hint: { color: C.muted, fontSize: 13 },
  chip: { paddingHorizontal: 12, height: 34, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface, justifyContent: 'center' },
  chipOn: { backgroundColor: C.greenSoft, borderColor: C.green },
  chipText: { fontWeight: '600', color: C.text2, fontSize: 13 },
  card: { flex: 1, backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.line, overflow: 'hidden' },
  cardImg: { width: '100%', aspectRatio: 4 / 3, backgroundColor: C.surface2 },
  cat: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: C.muted, textTransform: 'uppercase' },
  name: { fontSize: 15, fontWeight: '700', color: C.text },
  price: { fontSize: 15, fontWeight: '700', color: C.text },
  add: { backgroundColor: C.green, paddingHorizontal: 12, height: 32, borderRadius: 999, justifyContent: 'center' },
  addText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  qty: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.line, borderRadius: 999, backgroundColor: C.surface, alignSelf: 'flex-start' },
  qtyBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 16, fontWeight: '700', color: C.text },
  line: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 10 },
  lineImg: { width: 64, height: 64, borderRadius: 10, backgroundColor: C.surface2 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderColor: C.line },
  totalLabel: { fontSize: 16, color: C.text2 },
  totalValue: { fontSize: 18, fontWeight: '800', color: C.text },
  primary: { backgroundColor: C.green, height: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: C.muted, textTransform: 'uppercase' },
  input: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, height: 46, color: C.text, fontSize: 15 },
  summary: { backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 12, gap: 4 },
  check: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  order: { backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 12, gap: 4 },
  badge: { backgroundColor: C.greenSoft, paddingHorizontal: 10, height: 24, borderRadius: 999, justifyContent: 'center' },
  badgeText: { color: C.green, fontWeight: '700', fontSize: 11, textTransform: 'uppercase' },
  tabs: { flexDirection: 'row', borderTopWidth: 1, borderColor: C.line, backgroundColor: C.surface, position: 'absolute', left: 0, right: 0, bottom: 0, height: 60 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabOn: { borderTopWidth: 2, borderColor: C.green },
  tabText: { fontWeight: '700', color: C.text2 },
});
