# Çek Takip Sistemi

Ödenecek ve alınacak çeklerinizi kolayca takip edebileceğiniz modern bir web uygulaması.

## Özellikler

- ✅ Ödenecek ve alınacak çekleri ayrı ayrı takip etme
- ✅ Çek ekleme, düzenleme ve silme
- ✅ Vade tarihi takibi ve uyarıları
- ✅ Durum güncelleme (Ödenecek/Alınacak, Ödendi/Alındı)
- ✅ Toplam tutar hesaplama
- ✅ Responsive tasarım (Telefon, Tablet, Bilgisayar)
- ✅ LocalStorage ile veri saklama
- ✅ Kullanıcı dostu arayüz

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcınızda `http://localhost:5173` adresine gidin.

## Kullanım

1. **Yeni Çek Ekle**: "Yeni Çek Ekle" butonuna tıklayarak yeni bir çek ekleyebilirsiniz.
2. **Çek Düzenle**: Çek kartındaki düzenleme ikonuna tıklayarak çeki düzenleyebilirsiniz.
3. **Çek Sil**: Çek kartındaki silme ikonuna tıklayarak çeki silebilirsiniz.
4. **Durum Güncelle**: Çek kartındaki dropdown menüden durumu güncelleyebilirsiniz.

## Teknolojiler

- React 18
- Vite
- Tailwind CSS
- Lucide React (İkonlar)

## Notlar

- Veriler tarayıcınızın LocalStorage'ında saklanır
- Veriler sadece sizin bilgisayarınızda saklanır, başka cihazlarla senkronize olmaz
