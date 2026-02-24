import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Match } from '../models';
import CountdownTimer from './CountdownTimer';

const MEDIA_BASE_URL = 'https://media.smartb.com.au/smartb/';

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
          {item.tournamentName}
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
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0', // Flat design with dividers instead of cards
  },
  teamColumn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 48,
    height: 48,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  placeholderLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '700',
  },
  teamName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
  tournamentText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    marginBottom: 2,
  },
  tipsBadge: {
    marginTop: 6,
    backgroundColor: '#7986CB', // Soft blue/indigo badge
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tipsText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default MatchCard;
