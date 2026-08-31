export type NotionLeadPayload = {
  name: string;
  email?: string;
  phone?: string;
  brandName: string;
  segment?: string;
  source?: string;
};

export async function saveLeadToNotion(payload: NotionLeadPayload): Promise<boolean> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionApiKey || !databaseId) {
    // Modo seguro / fallback caso as credenciais do Notion ainda não estejam no .env
    console.log("[Notion Lead] Credenciais do Notion não configuradas. Lead recebido:", payload);
    return false;
  }

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionApiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [{ text: { content: payload.name } }]
          },
          Email: {
            email: payload.email || null
          },
          Phone: {
            phone_number: payload.phone || null
          },
          Brand: {
            rich_text: [{ text: { content: payload.brandName } }]
          },
          Segment: {
            rich_text: [{ text: { content: payload.segment || "" } }]
          },
          Source: {
            select: { name: payload.source || "Website" }
          }
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[Notion Lead Error]", err);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Notion Lead Exception]", error);
    return false;
  }
}
