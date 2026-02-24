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
      <View style={styles.headerRow}>
        <Text style={styles.tournamentText}>{item.tournamentName}</Text>
        <Text style={styles.sportText}>{item.sportName}</Text>
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.teamInfo}>
          <Image
            source={{ uri: `${MEDIA_BASE_URL}${item.team1.logo}` }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.teamName} numberOfLines={2}>
            {item.team1.name}
          </Text>
        </View>

        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <View style={styles.teamInfo}>
          <Image
            source={{ uri: `${MEDIA_BASE_URL}${item.team2.logo}` }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.teamName} numberOfLines={2}>
            {item.team2.name}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <CountdownTimer targetDate={item.startTime} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tournamentText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  sportText: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  vsContainer: {
    width: 40,
    alignItems: 'center',
  },
  vsText: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
});

export default MatchCard;
