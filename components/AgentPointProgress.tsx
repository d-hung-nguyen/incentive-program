'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Gift, TrendingUp, Zap } from 'lucide-react';

interface PointsData {
  totalEarned: number;
  totalRedeemed: number;
  availablePoints: number;
  canRedeem: boolean;
  nextThreshold: number;
}

interface AgentPointsProgressProps {
  agentId: string;
  refreshTrigger: number;
}

export default function AgentPointsProgress({ agentId, refreshTrigger }: AgentPointsProgressProps) {
  const [pointsData, setPointsData] = useState<PointsData>({
    totalEarned: 0,
    totalRedeemed: 0,
    availablePoints: 0,
    canRedeem: false,
    nextThreshold: 10,
  });
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    fetchPointsData();
  }, [agentId, refreshTrigger]);

  const fetchPointsData = async () => {
    try {
      const response = await fetch(`/api/agents/points?agent_id=${agentId}`);
      const data = await response.json();
      setPointsData(data);
    } catch (error) {
      console.error('Error fetching points data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!pointsData.canRedeem) return;

    setRedeeming(true);
    try {
      const pointsToRedeem = Math.floor(pointsData.availablePoints / 10) * 10;

      const response = await fetch('/api/agents/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agentId,
          points_to_redeem: pointsToRedeem,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          `Successfully redeemed ${pointsToRedeem} points for €${(pointsToRedeem * 0.01).toFixed(2)} voucher!`
        );
        fetchPointsData();
      } else {
        alert(result.error || 'Failed to redeem points');
      }
    } catch (error) {
      console.error('Error redeeming points:', error);
      alert('Failed to redeem points');
    } finally {
      setRedeeming(false);
    }
  };

  // Calculate progress to next threshold
  const currentThresholdLevel = Math.floor(pointsData.availablePoints / 10);
  const nextThreshold = (currentThresholdLevel + 1) * 10;
  const progressToNext = ((pointsData.availablePoints % 10) / 10) * 100;
  const redeemablePoints = Math.floor(pointsData.availablePoints / 10) * 10;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading points...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Points Card */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Award className="h-5 w-5" />
            Reward Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{pointsData.availablePoints}</div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">{pointsData.totalEarned}</div>
              <div className="text-xs text-muted-foreground">Total Earned</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-orange-600">
                {pointsData.totalRedeemed}
              </div>
              <div className="text-xs text-muted-foreground">Redeemed</div>
            </div>
          </div>

          {/* Progress to Next Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress to {nextThreshold} points</span>
              <span className="font-medium">{pointsData.availablePoints % 10}/10</span>
            </div>
            <Progress value={progressToNext} className="h-2" />
          </div>

          {/* Redemption Section */}
          {pointsData.canRedeem ? (
            <div className="rounded-lg border border-green-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Ready to Redeem!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Redeem {redeemablePoints} points for €{(redeemablePoints * 0.01).toFixed(2)}{' '}
                    voucher
                  </p>
                </div>
                <Button
                  onClick={handleRedeem}
                  disabled={redeeming}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {redeeming ? 'Processing...' : 'Redeem Now'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <div className="mb-1 flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-gray-700">Keep Going!</span>
              </div>
              <p className="text-sm text-gray-600">
                You need {10 - (pointsData.availablePoints % 10)} more points to reach the next
                redemption threshold
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Redemption Thresholds */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Redemption Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[10, 20, 30, 50, 100].map((threshold) => (
              <div
                key={threshold}
                className={`flex items-center justify-between rounded-lg p-2 ${
                  pointsData.availablePoints >= threshold
                    ? 'border border-green-200 bg-green-50'
                    : 'border border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant={pointsData.availablePoints >= threshold ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {threshold} pts
                  </Badge>
                  <span className="text-sm">€{(threshold * 0.01).toFixed(2)} voucher</span>
                </div>
                {pointsData.availablePoints >= threshold && (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
