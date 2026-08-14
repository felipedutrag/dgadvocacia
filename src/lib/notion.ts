const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

export interface LeadData {
  name: string;
  phone?: string;
  email?: string;
  brandName: string;
  segment?: string;
  source: "Simulator" | "Voice Search";
}

export async function saveLeadToNotion(lead: LeadData) {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    console.error("Notion credentials missing in environment variables.");
    return { success: false, error: "Notion credentials missing." };
  }

  try {
    const properties: any = {
      Lead: {
        title: [
          {
            text: {
              content: lead.name || `Lead - ${lead.brandName}`
            }
          }
        ]
      },
      "Custom Message": {
        rich_text: [
          {
            text: {
              content: `Marca consultada: "${lead.brandName}" | Ramo: ${lead.segment || "Não especificado"}`
            }
          }
        ]
      },
      Source: {
        select: {
          name: lead.source
        }
      }
    };

    if (lead.phone) {
      properties.Phone = {
        phone_number: lead.phone
      };
      
      // Clean phone number to generate a WhatsApp link
      const cleanPhone = lead.phone.replace(/\D/g, "");
      if (cleanPhone) {
        properties["WA Link"] = {
          url: `https://wa.me/${cleanPhone}`
        };
      }
    }

    if (lead.email) {
      properties.Email = {
        email: lead.email
      };
    }

    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        parent: {
          database_id: NOTION_DATABASE_ID
        },
        properties
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to save lead to Notion:", errorText);
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, pageId: data.id };
  } catch (error: any) {
    console.error("Error in saveLeadToNotion:", error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}
