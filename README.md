# ZENTRA Web Projesi

Bu proje, Cloudflare Pages ve Cloudflare D1 (Serverless SQL Database) altyapısı kullanılarak geliştirilmiş modern bir web uygulamasıdır. 

## 📋 Gereksinimler

Projenin çalıştırılması ve canlıya alınması için aşağıdaki araçların bilgisayarınızda kurulu olması gerekmektedir:
- [Node.js](https://nodejs.org/) (npm ile birlikte)
- Geçerli bir Cloudflare Hesabı

Cloudflare'in resmi aracı olan **Wrangler CLI**'ı global olarak kurmak için terminalinizde şu komutu çalıştırın:
```bash
npm install -g wrangler
```

---

## 🛠 Lokal Geliştirme (Local Environment)

Projeyi kendi bilgisayarınızda, Cloudflare ortamını (Pages ve yerel D1 veritabanı) simüle ederek test etmek için aşağıdaki adımları izleyin.

Terminalinizi proje kök dizininde açın ve şu komutu çalıştırın:

```bash
wrangler pages dev .
```
*(Eğer wrangler'ı global kurmadıysanız başına `npx` ekleyerek `npx wrangler pages dev .` şeklinde çalıştırabilirsiniz.)*

Bu komut, projenizi derleyip genellikle **`http://localhost:8788`** adresinde ayağa kaldıracaktır. Tarayıcınızdan bu adrese giderek lokal testlerinizi gerçekleştirebilirsiniz.

---

## 🚀 Sunucuya Deploy (Canlıya Alma)

Projedeki değişikliklerinizi tamamladıktan sonra Cloudflare sunucularına (canlı ortama) göndermek için aşağıdaki adımları izlemelisiniz.

**1. Cloudflare'a Giriş Yapın (Sadece ilk seferde veya oturum düştüğünde):**
```bash
wrangler login
```
*Bu komut tarayıcınızı açacak ve Cloudflare hesabınıza onay vermenizi isteyecektir.*

**2. Projeyi Deploy Edin:**
```bash
wrangler pages deploy .
```
Bu işlem bittiğinde, terminalde uygulamanızın canlıya alındığı ve herkesin erişebileceği `https://<proje-adi>.pages.dev` formatındaki URL adresini göreceksiniz.

---

## 💾 Veritabanı (Cloudflare D1) Yönetimi

Proje `dbbtkakademi` isimli Cloudflare D1 veritabanını kullanmaktadır. 

**Lokaldeki veritabanında tablo oluşturmak/SQL çalıştırmak için:**
```bash
wrangler d1 execute dbbtkakademi --local --file=schema.sql
```

**Canlıdaki (Remote) veritabanında tablo oluşturmak/SQL çalıştırmak için:**
```bash
wrangler d1 execute dbbtkakademi --remote --file=schema.sql
```