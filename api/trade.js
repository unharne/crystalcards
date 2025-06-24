// API endpoint для торговли картами
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
      handleGetTrade(req, res);
      break;
    case 'POST':
      handleCreateTrade(req, res);
      break;
    case 'PUT':
      handleAcceptTrade(req, res);
      break;
    case 'DELETE':
      handleCancelTrade(req, res);
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}

// Хранилище торгов (в реальном проекте используйте базу данных)
let trades = [];
let tradeIdCounter = 1;

function handleGetTrade(req, res) {
  const { playerId, tradeId } = req.query;

  if (tradeId) {
    // Получить конкретную сделку
    const trade = trades.find(t => t.id === parseInt(tradeId));
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    return res.json(trade);
  }

  if (playerId) {
    // Получить все сделки игрока
    const playerTrades = trades.filter(t => 
      t.fromPlayerId === playerId || t.toPlayerId === playerId
    );
    return res.json(playerTrades);
  }

  // Получить все активные сделки
  const activeTrades = trades.filter(t => t.status === 'active');
  res.json(activeTrades);
}

function handleCreateTrade(req, res) {
  const { fromPlayerId, toPlayerId, offeredCards, requestedCards, offeredMoney, requestedMoney, message } = req.body;

  if (!fromPlayerId || !toPlayerId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (fromPlayerId === toPlayerId) {
    return res.status(400).json({ error: 'Cannot trade with yourself' });
  }

  // Проверяем, что есть хотя бы карты или деньги для обмена
  if ((!offeredCards || offeredCards.length === 0) && (!offeredMoney || offeredMoney <= 0)) {
    return res.status(400).json({ error: 'Must offer at least cards or money' });
  }

  if ((!requestedCards || requestedCards.length === 0) && (!requestedMoney || requestedMoney <= 0)) {
    return res.status(400).json({ error: 'Must request at least cards or money' });
  }

  const trade = {
    id: tradeIdCounter++,
    fromPlayerId,
    toPlayerId,
    offeredCards: offeredCards || [],
    requestedCards: requestedCards || [],
    offeredMoney: offeredMoney || 0,
    requestedMoney: requestedMoney || 0,
    message: message || '',
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 часа
  };

  trades.push(trade);
  res.status(201).json(trade);
}

function handleAcceptTrade(req, res) {
  const { tradeId, playerId } = req.body;

  if (!tradeId || !playerId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const trade = trades.find(t => t.id === parseInt(tradeId));
  if (!trade) {
    return res.status(404).json({ error: 'Trade not found' });
  }

  if (trade.toPlayerId !== playerId) {
    return res.status(403).json({ error: 'Not authorized to accept this trade' });
  }

  if (trade.status !== 'active') {
    return res.status(400).json({ error: 'Trade is not active' });
  }

  // Проверяем, не истекла ли сделка
  if (new Date() > new Date(trade.expiresAt)) {
    trade.status = 'expired';
    return res.status(400).json({ error: 'Trade has expired' });
  }

  // Здесь в реальном приложении нужно было бы обновить балансы игроков
  // и передать карты между коллекциями
  // Для демонстрации просто помечаем сделку как завершенную

  trade.status = 'completed';
  trade.completedAt = new Date().toISOString();

  res.json(trade);
}

function handleCancelTrade(req, res) {
  const { tradeId, playerId } = req.body;

  if (!tradeId || !playerId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const trade = trades.find(t => t.id === parseInt(tradeId));
  if (!trade) {
    return res.status(404).json({ error: 'Trade not found' });
  }

  if (trade.fromPlayerId !== playerId) {
    return res.status(403).json({ error: 'Not authorized to cancel this trade' });
  }

  if (trade.status !== 'active') {
    return res.status(400).json({ error: 'Trade is not active' });
  }

  trade.status = 'cancelled';
  trade.cancelledAt = new Date().toISOString();

  res.json(trade);
} 