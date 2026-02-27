import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Match } from '../models';
import CountdownTimer from './CountdownTimer';

const MEDIA_BASE_URL = 'https://media.smartb.com.au/';

interface MatchCardProps {
  item: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* 3-Column Layout */}
      <View style={styles.teamColumn}>
        <View style={styles.logoWrapper}>
          {item.team1?.logo ? (
            <Image
              source={{ uri: `${MEDIA_BASE_URL}${item.team1.logo}` }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderLogo}>
              <Text style={styles.placeholderText}>{item.team1?.name?.charAt(0) || '?'}</Text>
            </View>
          )}
        </View>
        <Text style={styles.teamName} numberOfLines={2}>
          {item.team1?.name || 'TBA'}
        </Text>
      </View>

      <View style={styles.infoColumn}>
        <Text style={styles.tournamentText} numberOfLines={1}>
          {item.sportName}
        </Text>
        <Text style={styles.timeText}>
          {new Date(item.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }).toUpperCase()}
        </Text>
        <CountdownTimer targetDate={item.startTime} />
        <View style={styles.tipsBadge}>
          <Text style={styles.tipsText}>Tips</Text>
        </View>
      </View>

      <View style={styles.teamColumn}>
        <View style={styles.logoWrapper}>
          {item.team2?.logo ? (
            <Image
              source={{ uri: `${MEDIA_BASE_URL}${item.team2.logo}` }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderLogo}>
              <Text style={styles.placeholderText}>{item.team2?.name?.charAt(0) || '?'}</Text>
            </View>
          )}
        </View>
        <Text style={styles.teamName} numberOfLines={2}>
          {item.team2?.name || 'TBA'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  teamColumn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 44,
    height: 44,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
  },
  placeholderLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '700',
  },
  teamName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    lineHeight: 14,
  },
  tournamentText: {
    fontSize: 8,
    color: '#999',
    fontWeight: '700',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginBottom: 0,
  },
  tipsBadge: {
    marginTop: 4,
    backgroundColor: '#7986CB',
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 4,
  },
  tipsText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});

export default React.memo(MatchCard);
