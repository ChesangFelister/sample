
export interface UserProfile {
  id: string;
  worldcoinVerified: boolean;
  lastClaim: string | null;
  totalClaimed: number;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt: string | null;
  reward: number;
}

export interface ClaimStatus {
  canClaim: boolean;
  timeRemaining: number | null;
  nextClaimTime: string | null;
}

export interface WorldcoinVerification {
  nullifier_hash: string;
  merkle_root: string;
  proof: string;
  verification_level?: string;
  credential_type?: string;
}
