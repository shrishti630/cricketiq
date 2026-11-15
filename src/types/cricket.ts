export interface Team {
  id: string;
  name: string;
  short_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string;
  captain: string;
  coach: string;
  home_venue: string;
  titles: number;
  founded: number;
  squad_size?: number;
}

export interface PlayerStats {
  matches: number;
  runs: number;
  highest_score: string;
  strike_rate: number;
  average: number;
  fours: number;
  sixes: number;
  hundreds: number;
  fifties: number;
  wickets: number;
  economy_rate: number;
  fantasy_avg: number;
}

export interface Player {
  id: number;
  name: string;
  team_id: string;
  team_name?: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper' | string;
  nationality: string;
  batting_style: string;
  bowling_style?: string;
  credits: number;
  is_captain: boolean;
  is_overseas: boolean;
  recent_form: 'Excellent' | 'Good' | 'Average' | 'Poor' | string;
  stats?: PlayerStats;
}

export interface MatchVenue {
  id: string;
  name: string;
  city: string;
  pitch_type: string;
  avg_score: number;
}

export interface MatchTeam {
  id: string;
  name: string;
  short_name: string;
  color: string;
}

export interface Match {
  id: number;
  season: number;
  match_number: number;
  home_team: MatchTeam;
  away_team: MatchTeam;
  venue: MatchVenue;
  date: string;
  time: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  home_score?: string;
  away_score?: string;
  result_summary?: string;
  live_headline?: string;
  win_probability_home: number;
}

export interface StandingRow {
  position: number;
  team_id: string;
  team_name: string;
  short_name: string;
  color: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  nrr: number;
  recent_form: string[];
  qualification_prob: number;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  capacity: number;
  pitch_type: string;
  avg_first_innings_score: number;
  avg_second_innings_score: number;
  pace_wickets_pct: number;
  spin_wickets_pct: number;
  boundary_meters: number;
  weather_summary: string;
}

export interface AgentResponse {
  intent: string;
  agent_chain: string[];
  evidence: any;
  response: string;
  verdict: string;
  data_timestamp: string;
}
