// API endpoint для управления игроками
export default function handler(req, res) {
  // Включаем CORS для работы с фронтендом
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;

  switch (method) {
    case 'GET':
      handleGetPlayer(req, res);
      break;
    case 'POST':
      handleCreatePlayer(req, res);
      break;
    case 'PUT':
      handleUpdatePlayer(req, res);
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}

// Хранилище игроков (в реальном проекте используйте базу данных)
let players = [];
let playerIdCounter = 1;

function handleGetPlayer(req, res) {
  const { playerId } = req.query;

  if (playerId) {
    // Получить конкретного игрока
    const player = players.find(p => p.id === parseInt(playerId));
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    return res.json(player);
  }

  // Получить всех игроков (только публичную информацию)
  const publicPlayers = players.map(p => ({
    id: p.id,
    username: p.username,
    level: p.level,
    totalCards: p.collection.length,
    lastActive: p.lastActive
  }));
  res.json(publicPlayers);
}

function handleCreatePlayer(req, res) {
  const { username, collection, coins } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Проверяем, не занято ли имя пользователя
  if (players.find(p => p.username === username)) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  const player = {
    id: playerIdCounter++,
    username,
    collection: collection || [],
    coins: coins || 1000,
    level: 1,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };

  players.push(player);
  res.status(201).json(player);
}

function handleUpdatePlayer(req, res) {
  const { playerId } = req.query;
  const { collection, coins, level } = req.body;

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID is required' });
  }

  const player = players.find(p => p.id === parseInt(playerId));
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }

  // Обновляем только разрешенные поля
  if (collection !== undefined) player.collection = collection;
  if (coins !== undefined) player.coins = coins;
  if (level !== undefined) player.level = level;
  
  player.lastActive = new Date().toISOString();

  res.json(player);
} 