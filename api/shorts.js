export default async function handler(req, res) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key yok" });
    }

    // Örnek: tek kanal test
    const channelHandle = "Moktalojik";

    // 1. Kanal ID bul
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${channelHandle}&key=${apiKey}`
    );
    const chData = await chRes.json();

    if (!chData.items || chData.items.length === 0) {
      return res.status(404).json({ error: "Kanal bulunamadı" });
    }

    const uploadsPlaylist =
      chData.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. Son videoları çek
    const vidRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylist}&maxResults=5&key=${apiKey}`
    );
    const vidData = await vidRes.json();

    return res.status(200).json(vidData);
  } catch (err) {
    return res.status(500).json({
      error: "Sunucu hatası",
      details: err.message,
    });
  }
}
