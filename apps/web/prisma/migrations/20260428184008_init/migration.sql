-- CreateTable
CREATE TABLE "Pokemon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pokedexNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "flavorText" TEXT NOT NULL,
    "types" TEXT NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "specialAttack" INTEGER NOT NULL,
    "specialDefense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "abilities" TEXT NOT NULL,
    "moves" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "height" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "evolutionChain" TEXT NOT NULL,
    "encounterRate" INTEGER NOT NULL,
    "syncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pokemon_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "generation" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Trainer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "favoritePokemonId" TEXT,
    CONSTRAINT "Trainer_favoritePokemonId_fkey" FOREIGN KEY ("favoritePokemonId") REFERENCES "Pokemon" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Trainer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "position" INTEGER NOT NULL,
    "teamId" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,
    "nickname" TEXT,
    "level" INTEGER NOT NULL DEFAULT 50,
    "moveIds" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "TeamSlot_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamSlot_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trainerAId" TEXT NOT NULL,
    "trainerBId" TEXT NOT NULL,
    "teamAId" TEXT NOT NULL,
    "teamBId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "winnerId" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "Battle_trainerAId_fkey" FOREIGN KEY ("trainerAId") REFERENCES "Trainer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Battle_trainerBId_fkey" FOREIGN KEY ("trainerBId") REFERENCES "Trainer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Battle_teamAId_fkey" FOREIGN KEY ("teamAId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Battle_teamBId_fkey" FOREIGN KEY ("teamBId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Battle_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Trainer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BattleTurn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "battleId" TEXT NOT NULL,
    "turnNumber" INTEGER NOT NULL,
    "actionA" TEXT NOT NULL,
    "actionB" TEXT NOT NULL,
    "hpSnapshot" TEXT NOT NULL,
    CONSTRAINT "BattleTurn_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokedexNumber_key" ON "Pokemon"("pokedexNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_name_key" ON "Trainer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamSlot_teamId_position_key" ON "TeamSlot"("teamId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "BattleTurn_battleId_turnNumber_key" ON "BattleTurn"("battleId", "turnNumber");
