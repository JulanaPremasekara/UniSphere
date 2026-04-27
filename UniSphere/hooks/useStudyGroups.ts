import { useCallback, useEffect, useState } from 'react';
import apiClient from '../app/services/api';

export interface StudyGroup {
  id: string;
  subject: string;
  location: string;
  time: string;
  tag: string;
  participants: number;
  maxParticipants: number;
  learningGoals: string[];
}

const formatStudyGroup = (group: any): StudyGroup => ({
  id: group._id,
  subject: group.subject,
  location: group.location,
  time: group.time,
  tag: group.tag || 'GENERAL',
  participants: group.participants || 0,
  maxParticipants: group.maxParticipants || 12,
  learningGoals: Array.isArray(group.learningGoals) ? group.learningGoals : [],
});

export const useStudyGroups = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudyGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/studyGroups');
      const sessions = response.data?.data || [];
      setGroups(sessions.map(formatStudyGroup));
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch study groups');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudyGroups();
  }, [fetchStudyGroups]);

  return { groups, loading, error, refreshStudyGroups: fetchStudyGroups };
};
