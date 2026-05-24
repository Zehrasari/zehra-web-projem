export async function onRequest(context) {
  // Bağladığımız D1 veritabanına 'context.env.DB' üzerinden erişiyoruz
  const db = context.env.DB;
  const request = context.request;
  const method = request.method;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const emailParam = url.searchParams.get("email");

    switch (method) {
      case "GET": {
        // READ: Tüm kullanıcıları, id'si veya email'i verilen kullanıcıyı getir
        if (id) {
          const { results } = await db.prepare("SELECT * FROM kullanicilar WHERE id = ?").bind(id).all();
          return new Response(JSON.stringify(results[0] || null), { headers: { "Content-Type": "application/json" } });
        } else if (emailParam) {
          const { results } = await db.prepare("SELECT * FROM kullanicilar WHERE email = ?").bind(emailParam).all();
          return new Response(JSON.stringify(results[0] || null), { headers: { "Content-Type": "application/json" } });
        } else {
          const { results } = await db.prepare("SELECT * FROM kullanicilar").all();
          return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
        }
      }

      case "POST": {
        // CREATE: Yeni kullanıcı ekle
        const body = await request.json();
        const { ad, email, sifre } = body; 
        
        const result = await db.prepare("INSERT INTO kullanicilar (ad, email, sifre) VALUES (?, ?, ?)").bind(ad, email, sifre).run();
        return new Response(JSON.stringify({ success: true, result }), { status: 201, headers: { "Content-Type": "application/json" } });
      }

      case "PUT": {
        // UPDATE: Var olan kullanıcıyı id değerine göre güncelle
        if (!id) return new Response(JSON.stringify({ error: "Güncelleme işlemi için id parametresi gerekli" }), { status: 400, headers: { "Content-Type": "application/json" } });
        
        const body = await request.json();
        const { ad, email, sifre } = body;
        
        const result = await db.prepare("UPDATE kullanicilar SET ad = ?, email = ?, sifre = ? WHERE id = ?").bind(ad, email, sifre, id).run();
        return new Response(JSON.stringify({ success: true, result }), { headers: { "Content-Type": "application/json" } });
      }

      case "DELETE": {
        // DELETE: Kullanıcıyı id değerine göre sil
        if (!id) return new Response(JSON.stringify({ error: "Silme işlemi için id parametresi gerekli" }), { status: 400, headers: { "Content-Type": "application/json" } });
        
        const result = await db.prepare("DELETE FROM kullanicilar WHERE id = ?").bind(id).run();
        return new Response(JSON.stringify({ success: true, result }), { headers: { "Content-Type": "application/json" } });
      }

      default:
        return new Response("Method Not Allowed", { status: 405 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}