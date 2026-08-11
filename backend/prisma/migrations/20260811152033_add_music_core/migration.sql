-- CreateEnum
CREATE TYPE "MusicPlaySource" AS ENUM ('IMPORT', 'RECENTLY_PLAYED');

-- CreateEnum
CREATE TYPE "MusicActKind" AS ENUM ('UNCLASSIFIED', 'BAND', 'SOLO_PROJECT', 'DUO', 'GROUP', 'ORCHESTRA');

-- CreateEnum
CREATE TYPE "MusicAlbumType" AS ENUM ('ALBUM', 'SINGLE', 'EP', 'COMPILATION', 'LIVE', 'SOUNDTRACK');

-- CreateEnum
CREATE TYPE "MusicProvider" AS ENUM ('SPOTIFY', 'MUSICBRAINZ', 'DISCOGS', 'WIKIDATA', 'LASTFM');

-- CreateEnum
CREATE TYPE "MusicEntityKind" AS ENUM ('PERSON', 'ACT', 'ALBUM', 'TRACK');

-- CreateEnum
CREATE TYPE "MusicSyncStatus" AS ENUM ('PENDING', 'RUNNING', 'OK', 'FAILED');

-- CreateTable
CREATE TABLE "MusicPerson" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortName" TEXT,
    "birthDate" TIMESTAMP(3),
    "deathDate" TIMESTAMP(3),
    "originCountry" TEXT,
    "bio" TEXT,
    "photo" TEXT,
    "photoSourceUrl" TEXT,
    "photoFetchedAt" TIMESTAMP(3),
    "spotifyId" TEXT,
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MusicPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicalAct" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortName" TEXT,
    "actKind" "MusicActKind" NOT NULL DEFAULT 'UNCLASSIFIED',
    "formedYear" INTEGER,
    "disbandedYear" INTEGER,
    "originCity" TEXT,
    "originCountry" TEXT,
    "bio" TEXT,
    "image" TEXT,
    "imageSourceUrl" TEXT,
    "imageFetchedAt" TIMESTAMP(3),
    "bannerImage" TEXT,
    "bannerSourceUrl" TEXT,
    "bannerFetchedAt" TIMESTAMP(3),
    "popularity" INTEGER,
    "followers" INTEGER,
    "spotifyId" TEXT,
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MusicalAct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicRole" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicMembership" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "actId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicAlbum" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "albumType" "MusicAlbumType" NOT NULL DEFAULT 'ALBUM',
    "releaseDate" TIMESTAMP(3),
    "releaseDatePrecision" TEXT,
    "totalTracks" INTEGER,
    "label" TEXT,
    "popularity" INTEGER,
    "artwork" TEXT,
    "artworkSourceUrl" TEXT,
    "artworkFetchedAt" TIMESTAMP(3),
    "spotifyId" TEXT,
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "actId" TEXT NOT NULL,
    "eraId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MusicAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicTrack" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "discNumber" INTEGER NOT NULL DEFAULT 1,
    "trackNumber" INTEGER NOT NULL DEFAULT 0,
    "durationMs" INTEGER,
    "isExplicit" BOOLEAN NOT NULL DEFAULT false,
    "popularity" INTEGER,
    "spotifyId" TEXT,
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MusicTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicTrackCredit" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "personId" TEXT,
    "actId" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MusicTrackCredit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicGenre" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT,
    "accentKey" TEXT,
    "parentId" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicGenreOnAct" (
    "actId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "MusicGenreOnAct_pkey" PRIMARY KEY ("actId","genreId")
);

-- CreateTable
CREATE TABLE "MusicEra" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "actId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MusicEra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicExternalRef" (
    "id" TEXT NOT NULL,
    "provider" "MusicProvider" NOT NULL,
    "entityKind" "MusicEntityKind" NOT NULL,
    "externalId" TEXT NOT NULL,
    "url" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "personId" TEXT,
    "actId" TEXT,
    "albumId" TEXT,
    "trackId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicExternalRef_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicSyncState" (
    "id" TEXT NOT NULL,
    "entityKind" "MusicEntityKind" NOT NULL,
    "entityId" TEXT NOT NULL,
    "status" "MusicSyncStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicSyncState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicPlaylist" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trackCount" INTEGER,
    "durationMs" INTEGER,
    "artwork" TEXT,
    "artworkSourceUrl" TEXT,
    "artworkFetchedAt" TIMESTAMP(3),
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "spotifyId" TEXT,
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MusicPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicPlaylistTrack" (
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "addedAt" TIMESTAMP(3),

    CONSTRAINT "MusicPlaylistTrack_pkey" PRIMARY KEY ("playlistId","trackId")
);

-- CreateTable
CREATE TABLE "MusicPlay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL,
    "msPlayed" INTEGER,
    "spotifyTrackUri" TEXT,
    "trackName" TEXT NOT NULL,
    "artistName" TEXT,
    "albumName" TEXT,
    "source" "MusicPlaySource" NOT NULL DEFAULT 'IMPORT',
    "trackId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MusicPlay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MusicPerson_slug_key" ON "MusicPerson"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MusicPerson_spotifyId_key" ON "MusicPerson"("spotifyId");

-- CreateIndex
CREATE INDEX "MusicPerson_isDeleted_name_idx" ON "MusicPerson"("isDeleted", "name");

-- CreateIndex
CREATE UNIQUE INDEX "MusicalAct_slug_key" ON "MusicalAct"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MusicalAct_spotifyId_key" ON "MusicalAct"("spotifyId");

-- CreateIndex
CREATE INDEX "MusicalAct_isDeleted_name_idx" ON "MusicalAct"("isDeleted", "name");

-- CreateIndex
CREATE INDEX "MusicalAct_actKind_isDeleted_idx" ON "MusicalAct"("actKind", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "MusicRole_key_key" ON "MusicRole"("key");

-- CreateIndex
CREATE UNIQUE INDEX "MusicRole_slug_key" ON "MusicRole"("slug");

-- CreateIndex
CREATE INDEX "MusicMembership_personId_idx" ON "MusicMembership"("personId");

-- CreateIndex
CREATE INDEX "MusicMembership_actId_orderIndex_idx" ON "MusicMembership"("actId", "orderIndex");

-- CreateIndex
CREATE INDEX "MusicMembership_roleId_idx" ON "MusicMembership"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicMembership_actId_personId_roleId_startedAt_key" ON "MusicMembership"("actId", "personId", "roleId", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MusicAlbum_slug_key" ON "MusicAlbum"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MusicAlbum_spotifyId_key" ON "MusicAlbum"("spotifyId");

-- CreateIndex
CREATE INDEX "MusicAlbum_actId_albumType_isDeleted_idx" ON "MusicAlbum"("actId", "albumType", "isDeleted");

-- CreateIndex
CREATE INDEX "MusicAlbum_actId_releaseDate_idx" ON "MusicAlbum"("actId", "releaseDate");

-- CreateIndex
CREATE INDEX "MusicAlbum_eraId_idx" ON "MusicAlbum"("eraId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicTrack_slug_key" ON "MusicTrack"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MusicTrack_spotifyId_key" ON "MusicTrack"("spotifyId");

-- CreateIndex
CREATE INDEX "MusicTrack_albumId_discNumber_trackNumber_idx" ON "MusicTrack"("albumId", "discNumber", "trackNumber");

-- CreateIndex
CREATE INDEX "MusicTrack_isDeleted_idx" ON "MusicTrack"("isDeleted");

-- CreateIndex
CREATE INDEX "MusicTrackCredit_trackId_orderIndex_idx" ON "MusicTrackCredit"("trackId", "orderIndex");

-- CreateIndex
CREATE INDEX "MusicTrackCredit_personId_idx" ON "MusicTrackCredit"("personId");

-- CreateIndex
CREATE INDEX "MusicTrackCredit_actId_idx" ON "MusicTrackCredit"("actId");

-- CreateIndex
CREATE INDEX "MusicTrackCredit_roleId_idx" ON "MusicTrackCredit"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicGenre_slug_key" ON "MusicGenre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MusicGenre_key_key" ON "MusicGenre"("key");

-- CreateIndex
CREATE INDEX "MusicGenre_isApproved_idx" ON "MusicGenre"("isApproved");

-- CreateIndex
CREATE INDEX "MusicGenre_parentId_idx" ON "MusicGenre"("parentId");

-- CreateIndex
CREATE INDEX "MusicGenreOnAct_genreId_idx" ON "MusicGenreOnAct"("genreId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicEra_slug_key" ON "MusicEra"("slug");

-- CreateIndex
CREATE INDEX "MusicEra_actId_orderIndex_idx" ON "MusicEra"("actId", "orderIndex");

-- CreateIndex
CREATE INDEX "MusicExternalRef_personId_idx" ON "MusicExternalRef"("personId");

-- CreateIndex
CREATE INDEX "MusicExternalRef_actId_idx" ON "MusicExternalRef"("actId");

-- CreateIndex
CREATE INDEX "MusicExternalRef_albumId_idx" ON "MusicExternalRef"("albumId");

-- CreateIndex
CREATE INDEX "MusicExternalRef_trackId_idx" ON "MusicExternalRef"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicExternalRef_provider_entityKind_externalId_key" ON "MusicExternalRef"("provider", "entityKind", "externalId");

-- CreateIndex
CREATE INDEX "MusicSyncState_status_nextRunAt_idx" ON "MusicSyncState"("status", "nextRunAt");

-- CreateIndex
CREATE UNIQUE INDEX "MusicSyncState_entityKind_entityId_key" ON "MusicSyncState"("entityKind", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicPlaylist_slug_key" ON "MusicPlaylist"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MusicPlaylist_spotifyId_key" ON "MusicPlaylist"("spotifyId");

-- CreateIndex
CREATE INDEX "MusicPlaylist_isDeleted_isFavorite_orderIndex_idx" ON "MusicPlaylist"("isDeleted", "isFavorite", "orderIndex");

-- CreateIndex
CREATE INDEX "MusicPlaylistTrack_playlistId_position_idx" ON "MusicPlaylistTrack"("playlistId", "position");

-- CreateIndex
CREATE INDEX "MusicPlaylistTrack_trackId_idx" ON "MusicPlaylistTrack"("trackId");

-- CreateIndex
CREATE INDEX "MusicPlay_userId_playedAt_idx" ON "MusicPlay"("userId", "playedAt");

-- CreateIndex
CREATE INDEX "MusicPlay_userId_artistName_idx" ON "MusicPlay"("userId", "artistName");

-- CreateIndex
CREATE INDEX "MusicPlay_trackId_idx" ON "MusicPlay"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicPlay_userId_playedAt_spotifyTrackUri_key" ON "MusicPlay"("userId", "playedAt", "spotifyTrackUri");

-- AddForeignKey
ALTER TABLE "MusicMembership" ADD CONSTRAINT "MusicMembership_personId_fkey" FOREIGN KEY ("personId") REFERENCES "MusicPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicMembership" ADD CONSTRAINT "MusicMembership_actId_fkey" FOREIGN KEY ("actId") REFERENCES "MusicalAct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicMembership" ADD CONSTRAINT "MusicMembership_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "MusicRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicAlbum" ADD CONSTRAINT "MusicAlbum_actId_fkey" FOREIGN KEY ("actId") REFERENCES "MusicalAct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicAlbum" ADD CONSTRAINT "MusicAlbum_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "MusicEra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicTrack" ADD CONSTRAINT "MusicTrack_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "MusicAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicTrackCredit" ADD CONSTRAINT "MusicTrackCredit_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "MusicTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicTrackCredit" ADD CONSTRAINT "MusicTrackCredit_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "MusicRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicTrackCredit" ADD CONSTRAINT "MusicTrackCredit_personId_fkey" FOREIGN KEY ("personId") REFERENCES "MusicPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicTrackCredit" ADD CONSTRAINT "MusicTrackCredit_actId_fkey" FOREIGN KEY ("actId") REFERENCES "MusicalAct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicGenre" ADD CONSTRAINT "MusicGenre_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MusicGenre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicGenreOnAct" ADD CONSTRAINT "MusicGenreOnAct_actId_fkey" FOREIGN KEY ("actId") REFERENCES "MusicalAct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicGenreOnAct" ADD CONSTRAINT "MusicGenreOnAct_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "MusicGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicEra" ADD CONSTRAINT "MusicEra_actId_fkey" FOREIGN KEY ("actId") REFERENCES "MusicalAct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicExternalRef" ADD CONSTRAINT "MusicExternalRef_personId_fkey" FOREIGN KEY ("personId") REFERENCES "MusicPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicExternalRef" ADD CONSTRAINT "MusicExternalRef_actId_fkey" FOREIGN KEY ("actId") REFERENCES "MusicalAct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicExternalRef" ADD CONSTRAINT "MusicExternalRef_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "MusicAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicExternalRef" ADD CONSTRAINT "MusicExternalRef_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "MusicTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicPlaylistTrack" ADD CONSTRAINT "MusicPlaylistTrack_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "MusicPlaylist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicPlaylistTrack" ADD CONSTRAINT "MusicPlaylistTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "MusicTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicPlay" ADD CONSTRAINT "MusicPlay_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "MusicTrack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
