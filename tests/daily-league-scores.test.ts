import assert from "node:assert/strict";
import { test } from "node:test";
import {
  collectDailyLeagueScores,
  getCompactLeagueName,
} from "../lib/daily-league-scores";

test("daily league scores only include other members who played today", () => {
  const scores = collectDailyLeagueScores([
    {
      name: "Familjen",
      members: [
        {
          avatarDataUrl: null,
          displayName: "Jag",
          isCurrentUser: true,
          memberId: "me",
          todayScore: 8,
        },
        {
          avatarDataUrl: null,
          displayName: "Anna Andersson",
          isCurrentUser: false,
          memberId: "anna",
          todayScore: 14,
        },
        {
          avatarDataUrl: null,
          displayName: "Bosse",
          isCurrentUser: false,
          memberId: "bosse",
          todayScore: null,
        },
      ],
    },
  ]);

  assert.deepEqual(scores, [
    {
      avatarDataUrl: null,
      displayName: "Anna Andersson",
      id: "anna",
      leagueNames: ["Familjen"],
      score: 14,
    },
  ]);
});

test("daily league scores merge the same person across leagues and sort by score", () => {
  const sharedMember = {
    avatarDataUrl: "data:image/png;base64,anna",
    displayName: "Anna Andersson",
    isCurrentUser: false,
    todayScore: 11,
  };
  const scores = collectDailyLeagueScores([
    {
      name: "Familjen",
      members: [
        { ...sharedMember, memberId: "family-anna" },
        {
          avatarDataUrl: null,
          displayName: "Cecilia",
          isCurrentUser: false,
          memberId: "cecilia",
          todayScore: 15,
        },
      ],
    },
    {
      name: "Vännerna",
      members: [
        { ...sharedMember, memberId: "friends-anna" },
        {
          avatarDataUrl: null,
          displayName: "Bosse",
          isCurrentUser: false,
          memberId: "bosse",
          todayScore: 9,
        },
      ],
    },
  ]);

  assert.deepEqual(
    scores.map(({ displayName, leagueNames, score }) => ({
      displayName,
      leagueNames,
      score,
    })),
    [
      { displayName: "Cecilia", leagueNames: ["Familjen"], score: 15 },
      {
        displayName: "Anna Andersson",
        leagueNames: ["Familjen", "Vännerna"],
        score: 11,
      },
      { displayName: "Bosse", leagueNames: ["Vännerna"], score: 9 },
    ],
  );
});

test("compact league names use the first name", () => {
  assert.equal(getCompactLeagueName("  Anna Andersson  "), "Anna");
  assert.equal(getCompactLeagueName("Bosse"), "Bosse");
});
