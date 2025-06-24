// API endpoint для торговли картами
import { getPlayers, getPlayerById, updatePlayerById } from './players.js';

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

// Функция для получения игроков (в реальном проекте это был бы запрос к БД)
function getPlayersFromTrade() {
  return getPlayers();
}

// Функция для обновления игрока (в реальном проекте это был бы запрос к БД)
function updatePlayerFromTrade(playerId, updates) {
  return updatePlayerById(playerId, updates);
}

// Функция для установки списка игроков (вызывается из players.js)
export function setPlayers(playersList) {
  // Эта функция больше не нужна, так как мы используем общее хранилище
}

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

  // Получаем игроков
  const fromPlayer = getPlayerById(trade.fromPlayerId);
  const toPlayer = getPlayerById(trade.toPlayerId);

  if (!fromPlayer || !toPlayer) {
    return res.status(404).json({ error: 'Player not found' });
  }

  // Проверяем, что у игроков достаточно денег
  if (trade.offeredMoney > 0 && fromPlayer.coins < trade.offeredMoney) {
    return res.status(400).json({ error: 'Insufficient funds for trade' });
  }

  if (trade.requestedMoney > 0 && toPlayer.coins < trade.requestedMoney) {
    return res.status(400).json({ error: 'Insufficient funds for trade' });
  }

  // Выполняем обмен картами и деньгами
  try {
    // Передаем карты
    if (trade.offeredCards.length > 0) {
      // Удаляем карты у отправителя
      trade.offeredCards.forEach(cardId => {
        const cardIndex = fromPlayer.collection.findIndex(c => c.id == cardId);
        if (cardIndex !== -1) {
          const card = fromPlayer.collection.splice(cardIndex, 1)[0];
          toPlayer.collection.push(card);
        }
      });
    }

    if (trade.requestedCards.length > 0) {
      // Удаляем карты у получателя
      trade.requestedCards.forEach(cardId => {
        const cardIndex = toPlayer.collection.findIndex(c => c.id == cardId);
        if (cardIndex !== -1) {
          const card = toPlayer.collection.splice(cardIndex, 1)[0];
          fromPlayer.collection.push(card);
        }
      });
    }

    // Передаем деньги
    if (trade.offeredMoney > 0) {
      fromPlayer.coins -= trade.offeredMoney;
      toPlayer.coins += trade.offeredMoney;
    }

    if (trade.requestedMoney > 0) {
      toPlayer.coins -= trade.requestedMoney;
      fromPlayer.coins += trade.requestedMoney;
    }

    // Обновляем время последней активности
    fromPlayer.lastActive = new Date().toISOString();
    toPlayer.lastActive = new Date().toISOString();

    // Помечаем сделку как завершенную
    trade.status = 'completed';
    trade.completedAt = new Date().toISOString();

    res.json({
      trade,
      message: 'Trade completed successfully',
      fromPlayer: {
        id: fromPlayer.id,
        coins: fromPlayer.coins,
        collectionCount: fromPlayer.collection.length
      },
      toPlayer: {
        id: toPlayer.id,
        coins: toPlayer.coins,
        collectionCount: toPlayer.collection.length
      }
    });
  } catch (error) {
    console.error('Error completing trade:', error);
    res.status(500).json({ error: 'Internal server error during trade completion' });
  }
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