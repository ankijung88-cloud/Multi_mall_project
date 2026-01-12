.headers on
.mode column
SELECT "--- PartnerRequests (Top 5) ---";
SELECT id, userId, userName FROM PartnerRequest ORDER BY id DESC LIMIT 5;
SELECT "--- AgentRequests (Top 5) ---";
SELECT id, userId, userName FROM AgentRequest ORDER BY id DESC LIMIT 5;
SELECT "--- Users/Members (Top 5) ---";
SELECT name FROM sqlite_master WHERE type='table' AND name='User';
SELECT name FROM sqlite_master WHERE type='table' AND name='Member';
SELECT * FROM User ORDER BY id DESC LIMIT 5;
SELECT * FROM Member ORDER BY id DESC LIMIT 5;
