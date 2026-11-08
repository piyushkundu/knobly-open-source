import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getNewsAIExplanation } from "@/lib/news-ai";

export async function GET(request: Request) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    let docRef: any = null;

    if (isFirebaseConfigured) {
      try {
        docRef = doc(db, "dailyTechNews", today);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data() as any;
        if (docSnap.exists() && data?.daily_summary_en) {
          return NextResponse.json({ success: true, fromCache: true, data });
        }
      } catch (err) {
        console.warn("Firebase cache read failed, bypassing cache...", err);
      }
    }

    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) {
      throw new Error("GNEWS_API_KEY is not defined");
    }

    const [techRes, indRes, sportRes] = await Promise.all([
      fetch(`https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=10&apikey=${apiKey}`),
      fetch(`https://gnews.io/api/v4/top-headlines?category=general&country=in&lang=en&max=10&apikey=${apiKey}`),
      fetch(`https://gnews.io/api/v4/top-headlines?category=sports&lang=en&max=10&apikey=${apiKey}`)
    ]);

    const [techData, indData, sportData] = await Promise.all([
      techRes.json(), indRes.json(), sportRes.json()
    ]);

    const articles = [
      ...(techData.articles || []),
      ...(indData.articles || []),
      ...(sportData.articles || [])
    ];

    if (articles.length === 0) {
      throw new Error("No articles found from GNews");
    }

    let finalNewsList: any[] = [];

    try {
      const aiResponse = await getNewsAIExplanation(articles);
      const topNewsArray = aiResponse.top_news || [];
      
      finalNewsList = topNewsArray.map((item: any) => {
        // 1. Try exact title match
        let original = articles.find(a => a.title === item.original_title);
        
        // 2. Try partial title match
        if (!original) {
          original = articles.find(a => 
            a.title.includes(item.title_en) || 
            (item.title_en && item.title_en.includes(a.title)) ||
            (item.original_title && a.title.includes(item.original_title))
          );
        }
        
        // 3. Try to extract the literal number from "article_X"
        if (!original) {
          const rawId = item.article_id || item.index || "0";
          // Match digits exactly, e.g. "article_15" -> "15"
          const digitMatch = String(rawId).match(/\d+/);
          if (digitMatch) {
            const matchedId = parseInt(digitMatch[0], 10);
            if (!isNaN(matchedId) && articles[matchedId]) {
              original = articles[matchedId];
            }
          }
        }
        
        // 4. Absolute fallback
        if (!original) {
          original = articles[0]; // fallback to first item if all fails
        }

        return {
          title_en: item.title_en || original.title,
          title_hi: item.title_hi || original.title,
          category: item.category || "World",
          explanation_en: item.english || "Explanation not available.",
          explanation_hi: item.hindi || "Hindi explanation available nahi hai.",
          source: original?.source?.name || "Global News",
          url: original?.url || "#",
          image: original?.image || null,
          publishedAt: original?.publishedAt || new Date().toISOString()
        };
      });

      var daily_summary_en = aiResponse.daily_summary_en || "";
      var daily_summary_hi = aiResponse.daily_summary_hi || "";

    } catch (aiError) {
      console.error("AI Explanation failed:", aiError);
      finalNewsList = articles.slice(0, 10).map(a => ({
        title_en: a.title,
        title_hi: a.title,
        category: "Fallback",
        explanation_en: a.description,
        explanation_hi: "Hindi mein translate nahi ho paya.",
        source: a.source?.name,
        url: a.url,
        image: a.image || null,
        publishedAt: a.publishedAt
      }));
      var daily_summary_en = "Top 10 Global News Flash for today.";
      var daily_summary_hi = "आज के टॉप 10 मुख्य समाचार यहाँ दिए गए हैं।";
    }

    const newsDoc = {
      date: today,
      daily_summary_en,
      daily_summary_hi,
      newsList: finalNewsList
    };

    if (isFirebaseConfigured && docRef) {
      try {
        await setDoc(docRef, newsDoc);
      } catch (err) {
        console.warn("Firebase cache write failed...", err);
      }
    }

    return NextResponse.json({ success: true, fromCache: false, data: newsDoc });
  } catch (error: any) {
    console.error("Error in /api/tech-news:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch top categorized news." },
      { status: 500 }
    );
  }
}
