import { Team, Player, Match, StandingRow, Venue, AgentResponse } from '../types/cricket';
import { 
  IPL_TEAMS, 
  IPL_PLAYERS, 
  IPL_STANDINGS, 
  IPL_MATCHES, 
  IPL_VENUES, 
  standaloneAgent 
} from './agentEngine';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function fetchTeams(): Promise<Team[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/teams/`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Failed to fetch teams');
    return await res.json();
  } catch (err) {
    return IPL_TEAMS;
  }
}

export async function fetchPlayers(team?: string, role?: string, search?: string): Promise<Player[]> {
  try {
    const params = new URLSearchParams();
    if (team) params.append('team', team);
    if (role) params.append('role', role);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE_URL}/players/?${params.toString()}`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Failed to fetch players');
    return await res.json();
  } catch (err) {
    let list = [...IPL_PLAYERS];
    if (team && team !== 'ALL') list = list.filter(p => p.team_id === team);
    if (role && role !== 'ALL') list = list.filter(p => p.role.toLowerCase().includes(role.toLowerCase()));
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }
}

export async function comparePlayers(p1: string, p2: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/players/compare?player1=${encodeURIComponent(p1)}&player2=${encodeURIComponent(p2)}`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Comparison failed');
    return await res.json();
  } catch (err) {
    const agentRes = standaloneAgent.executeQuery(`Compare ${p1} and ${p2}`);
    return {
      error: false,
      statistical_edge: agentRes.evidence.fav,
      deltas: {
        strike_rate_delta: Number(agentRes.evidence.srDelta),
        average_delta: Number(agentRes.evidence.avgDelta),
        wickets_delta: 0,
        economy_delta: 0.0
      }
    };
  }
}

export async function fetchMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/matches/`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Failed to fetch matches');
    return await res.json();
  } catch (err) {
    return IPL_MATCHES;
  }
}

export async function fetchStandings(): Promise<StandingRow[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/standings/`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Failed to fetch standings');
    return await res.json();
  } catch (err) {
    return IPL_STANDINGS;
  }
}

export async function fetchVenues(): Promise<Venue[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/venues/`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Failed to fetch venues');
    return await res.json();
  } catch (err) {
    return IPL_VENUES;
  }
}

export async function askAgent(query: string): Promise<AgentResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) throw new Error('Backend agent endpoint returned error');
    return await res.json();
  } catch (err) {
    // Graceful autonomous client-side agent execution on Vercel
    return standaloneAgent.executeQuery(query);
  }
}

export async function optimizeFantasySquad(team1: string = 'CSK', team2: string = 'MI'): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/fantasy/optimize?team1=${team1}&team2=${team2}`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Fantasy optimizer failed');
    return await res.json();
  } catch (err) {
    const agentRes = standaloneAgent.executeQuery(`Build fantasy XI for ${team1} vs ${team2}`);
    return {
      status: 'success',
      squad: agentRes.evidence.squad,
      total_credits: agentRes.evidence.credits,
      captain: agentRes.evidence.captain,
      vice_captain: agentRes.evidence.vc
    };
  }
}

export async function validateFantasySquad(players: any[], captain_id: number, vice_captain_id: number): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/fantasy/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ players, captain_id, vice_captain_id }),
      signal: AbortSignal.timeout(2000)
    });
    if (!res.ok) throw new Error('Fantasy validation failed');
    return await res.json();
  } catch (err) {
    const totalCredits = players.reduce((s, p) => s + (p.credits || 8.5), 0);
    return {
      valid: players.length === 11 && totalCredits <= 100.0,
      total_credits: totalCredits,
      errors: players.length !== 11 ? [`Need 11 players, currently ${players.length}`] : []
    };
  }
}
