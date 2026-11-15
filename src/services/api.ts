import { Team, Player, Match, StandingRow, Venue, AgentResponse } from '../types/cricket';

const API_BASE_URL = 'http://localhost:8000/api';

// Fallback seed data in case backend server is restarting or initializing
const FALLBACK_TEAMS: Team[] = [
  { id: 'CSK', name: 'Chennai Super Kings', short_name: 'CSK', primary_color: '#F9CD05', secondary_color: '#005CA9', accent_color: '#FFD700', logo_url: '', captain: 'Ruturaj Gaikwad', coach: 'Stephen Fleming', home_venue: 'MA Chidambaram Stadium', titles: 5, founded: 2008, squad_size: 25 },
  { id: 'MI', name: 'Mumbai Indians', short_name: 'MI', primary_color: '#004BA0', secondary_color: '#D1AB3E', accent_color: '#0077B6', logo_url: '', captain: 'Hardik Pandya', coach: 'Mark Boucher', home_venue: 'Wankhede Stadium', titles: 5, founded: 2008, squad_size: 25 },
  { id: 'RCB', name: 'Royal Challengers Bengaluru', short_name: 'RCB', primary_color: '#EC1C24', secondary_color: '#1D1D1B', accent_color: '#B3995D', logo_url: '', captain: 'Faf du Plessis', coach: 'Andy Flower', home_venue: 'M. Chinnaswamy Stadium', titles: 0, founded: 2008, squad_size: 25 },
  { id: 'KKR', name: 'Kolkata Knight Riders', short_name: 'KKR', primary_color: '#3A225D', secondary_color: '#B3995D', accent_color: '#7B2CBF', logo_url: '', captain: 'Shreyas Iyer', coach: 'Chandrakant Pandit', home_venue: 'Eden Gardens', titles: 3, founded: 2008, squad_size: 24 },
  { id: 'RR', name: 'Rajasthan Royals', short_name: 'RR', primary_color: '#EA1A85', secondary_color: '#254AA5', accent_color: '#FF4081', logo_url: '', captain: 'Sanju Samson', coach: 'Rahul Dravid', home_venue: 'Sawai Mansingh Stadium', titles: 1, founded: 2008, squad_size: 23 },
  { id: 'SRH', name: 'Sunrisers Hyderabad', short_name: 'SRH', primary_color: '#F26522', secondary_color: '#000000', accent_color: '#FF7A00', logo_url: '', captain: 'Pat Cummins', coach: 'Daniel Vettori', home_venue: 'Rajiv Gandhi Intl Stadium', titles: 1, founded: 2013, squad_size: 25 },
  { id: 'GT', name: 'Gujarat Titans', short_name: 'GT', primary_color: '#1B2133', secondary_color: '#C0A868', accent_color: '#243447', logo_url: '', captain: 'Shubman Gill', coach: 'Ashish Nehra', home_venue: 'Narendra Modi Stadium', titles: 1, founded: 2022, squad_size: 24 },
  { id: 'LSG', name: 'Lucknow Super Giants', short_name: 'LSG', primary_color: '#0057E7', secondary_color: '#E35205', accent_color: '#00A8FF', logo_url: '', captain: 'KL Rahul', coach: 'Justin Langer', home_venue: 'BRSABV Ekana Stadium', titles: 0, founded: 2022, squad_size: 23 },
  { id: 'DC', name: 'Delhi Capitals', short_name: 'DC', primary_color: '#004C93', secondary_color: '#EF3829', accent_color: '#1E88E5', logo_url: '', captain: 'Rishabh Pant', coach: 'Ricky Ponting', home_venue: 'Arun Jaitley Stadium', titles: 0, founded: 2008, squad_size: 24 },
  { id: 'PK', name: 'Punjab Kings', short_name: 'PK', primary_color: '#ED1B24', secondary_color: '#D7A22A', accent_color: '#FF3B30', logo_url: '', captain: 'Shikhar Dhawan', coach: 'Trevor Bayliss', home_venue: 'HPCA Stadium', titles: 0, founded: 2008, squad_size: 25 },
];

export async function fetchTeams(): Promise<Team[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/teams/`);
    if (!res.ok) throw new Error('Failed to fetch teams');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using pre-loaded IPL franchise data');
    return FALLBACK_TEAMS;
  }
}

export async function fetchPlayers(team?: string, role?: string, search?: string): Promise<Player[]> {
  try {
    const params = new URLSearchParams();
    if (team) params.append('team', team);
    if (role) params.append('role', role);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE_URL}/players/?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch players');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, returning fallback player scout data');
    return [
      { id: 1, name: 'Virat Kohli', team_id: 'RCB', role: 'Batsman', nationality: 'India', batting_style: 'Right-hand bat', credits: 10.5, is_captain: false, is_overseas: false, recent_form: 'Excellent', stats: { matches: 252, runs: 8004, highest_score: '113*', strike_rate: 131.9, average: 38.6, fours: 705, sixes: 272, hundreds: 8, fifties: 55, wickets: 4, economy_rate: 8.7, fantasy_avg: 68.5 } },
      { id: 2, name: 'Rohit Sharma', team_id: 'MI', role: 'Batsman', nationality: 'India', batting_style: 'Right-hand bat', credits: 10.0, is_captain: false, is_overseas: false, recent_form: 'Good', stats: { matches: 257, runs: 6628, highest_score: '109*', strike_rate: 131.1, average: 29.7, fours: 599, sixes: 280, hundreds: 2, fifties: 43, wickets: 15, economy_rate: 8.0, fantasy_avg: 49.8 } },
      { id: 3, name: 'Jasprit Bumrah', team_id: 'MI', role: 'Bowler', nationality: 'India', batting_style: 'Right-hand bat', credits: 10.5, is_captain: false, is_overseas: false, recent_form: 'Excellent', stats: { matches: 133, runs: 69, highest_score: '16*', strike_rate: 97.1, average: 9.8, fours: 6, sixes: 1, hundreds: 0, fifties: 0, wickets: 165, economy_rate: 7.30, fantasy_avg: 64.2 } },
      { id: 4, name: 'Ruturaj Gaikwad', team_id: 'CSK', role: 'Batsman', nationality: 'India', batting_style: 'Right-hand bat', credits: 9.5, is_captain: true, is_overseas: false, recent_form: 'Excellent', stats: { matches: 66, runs: 2380, highest_score: '108*', strike_rate: 136.8, average: 39.0, fours: 230, sixes: 88, hundreds: 2, fifties: 18, wickets: 0, economy_rate: 0.0, fantasy_avg: 54.2 } },
      { id: 5, name: 'Sunil Narine', team_id: 'KKR', role: 'All-Rounder', nationality: 'West Indies', batting_style: 'Left-hand bat', credits: 10.0, is_captain: false, is_overseas: true, recent_form: 'Excellent', stats: { matches: 177, runs: 1534, highest_score: '109', strike_rate: 165.8, average: 17.2, fours: 160, sixes: 95, hundreds: 1, fifties: 7, wickets: 180, economy_rate: 6.73, fantasy_avg: 72.1 } }
    ];
  }
}

export async function comparePlayers(p1: string, p2: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/players/compare?player1=${encodeURIComponent(p1)}&player2=${encodeURIComponent(p2)}`);
  if (!res.ok) throw new Error('Comparison failed');
  return await res.json();
}

export async function fetchMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/matches/`);
    if (!res.ok) throw new Error('Failed to fetch matches');
    return await res.json();
  } catch (err) {
    return [
      {
        id: 1,
        season: 2025,
        match_number: 48,
        home_team: { id: 'CSK', name: 'Chennai Super Kings', short_name: 'CSK', color: '#F9CD05' },
        away_team: { id: 'MI', name: 'Mumbai Indians', short_name: 'MI', color: '#004BA0' },
        venue: { id: 'chepauk', name: 'MA Chidambaram Stadium', city: 'Chennai', pitch_type: 'Spin Haven', avg_score: 168 },
        date: '2025-05-18',
        time: '19:30 IST',
        status: 'LIVE',
        home_score: '189/4 (20.0)',
        away_score: '148/5 (15.4)',
        live_headline: 'MI need 42 runs in 26 balls. Suryakumar 58*(32) battling Jadeja’s spin web!',
        win_probability_home: 63.5
      }
    ];
  }
}

export async function fetchStandings(): Promise<StandingRow[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/standings/`);
    if (!res.ok) throw new Error('Failed to fetch standings');
    return await res.json();
  } catch (err) {
    return [
      { position: 1, team_id: 'KKR', team_name: 'Kolkata Knight Riders', short_name: 'KKR', color: '#3A225D', played: 14, won: 9, lost: 3, points: 20, nrr: 1.428, recent_form: ['W','W','W','W','W'], qualification_prob: 99.9 },
      { position: 2, team_id: 'SRH', team_name: 'Sunrisers Hyderabad', short_name: 'SRH', color: '#F26522', played: 14, won: 8, lost: 5, points: 17, nrr: 0.414, recent_form: ['W','W','L','W','W'], qualification_prob: 98.5 },
      { position: 3, team_id: 'RR', team_name: 'Rajasthan Royals', short_name: 'RR', color: '#EA1A85', played: 14, won: 8, lost: 5, points: 17, nrr: 0.273, recent_form: ['L','L','L','L','W'], qualification_prob: 95.0 },
      { position: 4, team_id: 'RCB', team_name: 'Royal Challengers Bengaluru', short_name: 'RCB', color: '#EC1C24', played: 14, won: 7, lost: 7, points: 14, nrr: 0.459, recent_form: ['W','W','W','W','W'], qualification_prob: 78.4 },
      { position: 5, team_id: 'CSK', team_name: 'Chennai Super Kings', short_name: 'CSK', color: '#F9CD05', played: 14, won: 7, lost: 7, points: 14, nrr: 0.392, recent_form: ['L','W','L','W','L'], qualification_prob: 42.1 }
    ];
  }
}

export async function fetchVenues(): Promise<Venue[]> {
  const res = await fetch(`${API_BASE_URL}/venues/`);
  if (!res.ok) throw new Error('Failed to fetch venues');
  return await res.json();
}

export async function askAgent(query: string): Promise<AgentResponse> {
  const res = await fetch(`${API_BASE_URL}/ai/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error('Agent failed to process query');
  return await res.json();
}

export async function optimizeFantasySquad(team1: string, team2: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/fantasy/optimize?team1=${team1}&team2=${team2}`);
  if (!res.ok) throw new Error('Fantasy optimizer failed');
  return await res.json();
}

export async function validateFantasySquad(players: any[], captain_id: number, vice_captain_id: number): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/fantasy/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ players, captain_id, vice_captain_id })
  });
  if (!res.ok) throw new Error('Fantasy validation failed');
  return await res.json();
}
