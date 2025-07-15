import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useDietStore } from '../store/dietStore';
import { useRecipeStore } from '../store/recipeStore';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { tr } from 'date-fns/locale';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year
  const [selectedMetric, setSelectedMetric] = useState('calories'); // calories, protein, carb, fat
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const { meals, getNutritionForDate, getWeeklyStats, getMonthlyStats } = useDietStore();
  const { getRecipeStats } = useRecipeStore();

  useEffect(() => {
    generateAnalytics();
  }, [selectedPeriod, selectedMetric]);

  const generateAnalytics = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let data = [];
      let labels = [];
      let totalStats = { calories: 0, protein: 0, carb: 0, fat: 0 };
      let averageStats = { calories: 0, protein: 0, carb: 0, fat: 0 };

      if (selectedPeriod === 'week') {
        const startDate = startOfWeek(now, { weekStartsOn: 1 });
        const endDate = endOfWeek(now, { weekStartsOn: 1 });
        
        for (let i = 0; i < 7; i++) {
          const date = subDays(endDate, 6 - i);
          const dayStats = getNutritionForDate(format(date, 'yyyy-MM-dd'));
          
          data.push(dayStats[selectedMetric] || 0);
          labels.push(format(date, 'EEE', { locale: tr }));
          
          totalStats.calories += dayStats.calories || 0;
          totalStats.protein += dayStats.protein || 0;
          totalStats.carb += dayStats.carb || 0;
          totalStats.fat += dayStats.fat || 0;
        }
      } else if (selectedPeriod === 'month') {
        const startDate = startOfMonth(now);
        const endDate = endOfMonth(now);
        const daysInMonth = endDate.getDate();
        
        // Group by weeks for month view
        const weeklyData = getWeeklyStats(4); // Last 4 weeks
        data = weeklyData.map(week => week[selectedMetric] || 0);
        labels = weeklyData.map((_, index) => `${index + 1}. Hafta`);
        
        // Calculate monthly totals
        for (let i = 0; i < daysInMonth; i++) {
          const date = new Date(startDate.getFullYear(), startDate.getMonth(), i + 1);
          const dayStats = getNutritionForDate(format(date, 'yyyy-MM-dd'));
          
          totalStats.calories += dayStats.calories || 0;
          totalStats.protein += dayStats.protein || 0;
          totalStats.carb += dayStats.carb || 0;
          totalStats.fat += dayStats.fat || 0;
        }
      } else if (selectedPeriod === 'year') {
        const monthlyData = getMonthlyStats(12); // Last 12 months
        data = monthlyData.map(month => month[selectedMetric] || 0);
        labels = monthlyData.map((_, index) => {
          const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
          return format(date, 'MMM', { locale: tr });
        });
        
        // Calculate yearly totals
        totalStats = monthlyData.reduce((acc, month) => ({
          calories: acc.calories + (month.calories || 0),
          protein: acc.protein + (month.protein || 0),
          carb: acc.carb + (month.carb || 0),
          fat: acc.fat + (month.fat || 0),
        }), { calories: 0, protein: 0, carb: 0, fat: 0 });
      }

      // Calculate averages
      const periodDays = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
      averageStats = {
        calories: Math.round(totalStats.calories / periodDays),
        protein: Math.round(totalStats.protein / periodDays),
        carb: Math.round(totalStats.carb / periodDays),
        fat: Math.round(totalStats.fat / periodDays),
      };

      // Generate insights
      const insights = generateInsights(data, totalStats, averageStats);
      
      setAnalytics({
        chartData: data,
        chartLabels: labels,
        totalStats,
        averageStats,
        insights,
        recipeStats: getRecipeStats(),
      });
    } catch (error) {
      console.error('Error generating analytics:', error);
      Alert.alert('Hata', 'Analitik veriler oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (data, totalStats, averageStats) => {
    const insights = [];
    
    // Trend analysis
    if (data.length >= 2) {
      const firstHalf = data.slice(0, Math.floor(data.length / 2));
      const secondHalf = data.slice(Math.floor(data.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
      
      const trend = secondAvg > firstAvg ? 'artış' : secondAvg < firstAvg ? 'azalış' : 'stabil';
      const trendPercent = Math.abs(((secondAvg - firstAvg) / firstAvg) * 100).toFixed(1);
      
      insights.push({
        type: 'trend',
        title: `${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Trendi`,
        description: `${selectedPeriod === 'week' ? 'Bu hafta' : selectedPeriod === 'month' ? 'Bu ay' : 'Bu yıl'} ${trend} gösteriyor (${trendPercent}%)`,
        icon: trend === 'artış' ? '📈' : trend === 'azalış' ? '📉' : '➡️',
      });
    }
    
    // Goal comparison
    const goalCalories = 2000; // Default goal, should come from user settings
    const goalProtein = 150;
    const goalCarb = 200;
    const goalFat = 65;
    
    const goals = { calories: goalCalories, protein: goalProtein, carb: goalCarb, fat: goalFat };
    const currentGoal = goals[selectedMetric];
    const achievement = (averageStats[selectedMetric] / currentGoal) * 100;
    
    insights.push({
      type: 'goal',
      title: 'Hedef Başarısı',
      description: `Günlük hedefinin %${achievement.toFixed(1)}'ini başarıyorsun`,
      icon: achievement >= 90 ? '🎯' : achievement >= 70 ? '👍' : '⚠️',
    });
    
    // Consistency analysis
    const variance = data.reduce((sum, val) => sum + Math.pow(val - averageStats[selectedMetric], 2), 0) / data.length;
    const standardDeviation = Math.sqrt(variance);
    const consistencyScore = 100 - (standardDeviation / averageStats[selectedMetric]) * 100;
    
    insights.push({
      type: 'consistency',
      title: 'Tutarlılık Skoru',
      description: `%${Math.max(0, consistencyScore).toFixed(1)} tutarlı beslenme`,
      icon: consistencyScore >= 80 ? '🔥' : consistencyScore >= 60 ? '💪' : '🎯',
    });
    
    return insights;
  };

  const getPieChartData = () => {
    if (!analytics) return [];
    
    const { totalStats } = analytics;
    const total = totalStats.protein + totalStats.carb + totalStats.fat;
    
    return [
      {
        name: 'Protein',
        population: totalStats.protein,
        color: '#FF6B6B',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Karbonhidrat',
        population: totalStats.carb,
        color: '#4ECDC4',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Yağ',
        population: totalStats.fat,
        color: '#45B7D1',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ];
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(69, 183, 209, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Analitik veriler hazırlanıyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Period Selection */}
      <View style={styles.periodSelector}>
        {['week', 'month', 'year'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.selectedPeriodButton,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.selectedPeriodButtonText,
              ]}
            >
              {period === 'week' ? 'Hafta' : period === 'month' ? 'Ay' : 'Yıl'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Metric Selection */}
      <View style={styles.metricSelector}>
        {['calories', 'protein', 'carb', 'fat'].map((metric) => (
          <TouchableOpacity
            key={metric}
            style={[
              styles.metricButton,
              selectedMetric === metric && styles.selectedMetricButton,
            ]}
            onPress={() => setSelectedMetric(metric)}
          >
            <Text
              style={[
                styles.metricButtonText,
                selectedMetric === metric && styles.selectedMetricButtonText,
              ]}
            >
              {metric === 'calories' ? 'Kalori' : 
               metric === 'protein' ? 'Protein' : 
               metric === 'carb' ? 'Karbonhidrat' : 'Yağ'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {analytics && (
        <>
          {/* Main Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>
              {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Trendi
            </Text>
            <LineChart
              data={{
                labels: analytics.chartLabels,
                datasets: [
                  {
                    data: analytics.chartData,
                  },
                ],
              }}
              width={screenWidth - 32}
              height={220}
              yAxisInterval={1}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>

          {/* Summary Stats */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Özet İstatistikler</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{analytics.totalStats.calories}</Text>
                <Text style={styles.summaryLabel}>Toplam Kalori</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{analytics.averageStats.calories}</Text>
                <Text style={styles.summaryLabel}>Günlük Ortalama</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{analytics.totalStats.protein}g</Text>
                <Text style={styles.summaryLabel}>Toplam Protein</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{analytics.totalStats.carb}g</Text>
                <Text style={styles.summaryLabel}>Toplam Karbonhidrat</Text>
              </View>
            </View>
          </View>

          {/* Macro Distribution */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Makro Besin Dağılımı</Text>
            <PieChart
              data={getPieChartData()}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          </View>

          {/* Insights */}
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Analiz ve Öneriler</Text>
            {analytics.insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <Text style={styles.insightIcon}>{insight.icon}</Text>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Recipe Stats */}
          {analytics.recipeStats.totalRecipes > 0 && (
            <View style={styles.recipeStatsContainer}>
              <Text style={styles.recipeStatsTitle}>Tarif İstatistikleri</Text>
              <View style={styles.recipeStatsRow}>
                <View style={styles.recipeStatsCard}>
                  <Text style={styles.recipeStatsValue}>{analytics.recipeStats.totalRecipes}</Text>
                  <Text style={styles.recipeStatsLabel}>Toplam Tarif</Text>
                </View>
                <View style={styles.recipeStatsCard}>
                  <Text style={styles.recipeStatsValue}>{analytics.recipeStats.avgCalories}</Text>
                  <Text style={styles.recipeStatsLabel}>Ortalama Kalori</Text>
                </View>
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 10,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedPeriodButton: {
    backgroundColor: '#45B7D1',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedPeriodButtonText: {
    color: '#fff',
  },
  metricSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedMetricButton: {
    backgroundColor: '#45B7D1',
  },
  metricButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedMetricButtonText: {
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 10,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#45B7D1',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  insightsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  insightDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  recipeStatsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeStatsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  recipeStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeStatsCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  recipeStatsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#45B7D1',
  },
  recipeStatsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default AnalyticsScreen;
