export interface Tournament {
  id: number;
  name: string;
}

export interface Sport {
  id: number;
  sportName: string;
  tournaments: Tournament[];
}

export interface Team {
  name: string;
  logo: string; // Relative path
}

export interface Match {
  id: number;
  startTime: string; // ISO Date string
  team1: Team;
  team2: Team;
  tournamentName: string;
  sportName: string;
  status: 'upcoming' | 'live' | 'finished';
}

export interface MatchListResponse {
  matches: Match[];
  totalCount: number;
}
