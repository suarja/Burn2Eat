#!/usr/bin/env ts-node

/**
 * Dataset validation script
 * Run with: npx ts-node scripts/validate-dataset.ts
 */

import { 
  generateDatasetReport, 
  validateImageUrls, 
  FOODS_DATASET,
  DATASET_STATS 
} from '../src/infrastructure/data';

async function main() {
  console.log('🍔 Burn2Eat Food Dataset Validation\n');

  // Basic validation report
  console.log('📊 VALIDATION REPORT');
  console.log('==================');
  const report = generateDatasetReport();
  console.log(report);

  // Quick stats
  console.log('📈 DATASET STATISTICS');
  console.log('====================');
  console.log(`Total Foods: ${DATASET_STATS.totalFoods}`);
  console.log(`Categories: ${DATASET_STATS.categories.join(', ')}`);
  console.log(`Average Calories: ${DATASET_STATS.averageCalories} kcal`);
  console.log('');

  // Category breakdown
  console.log('🏷️  CATEGORY BREAKDOWN');
  console.log('=====================');
  DATASET_STATS.categories.forEach(category => {
    const foods = FOODS_DATASET.filter(f => f.category === category);
    console.log(`${category}: ${foods.length} items`);
    foods.forEach(food => {
      console.log(`  - ${food.names.en} (${food.calories} kcal)`);
    });
    console.log('');
  });

  // Image URL validation (optional - can be slow)
  const validateImages = process.argv.includes('--validate-images');
  
  if (validateImages) {
    console.log('🖼️  IMAGE VALIDATION (this may take a while...)');
    console.log('===============================================');
    
    try {
      const imageValidation = await validateImageUrls();
      
      console.log(`✅ Accessible images: ${imageValidation.accessible.length}`);
      
      if (imageValidation.broken.length > 0) {
        console.log(`❌ Broken images: ${imageValidation.broken.length}`);
        imageValidation.broken.forEach(({ foodId, url, error }) => {
          console.log(`  - ${foodId}: ${url}`);
          console.log(`    Error: ${error}`);
        });
      } else {
        console.log('🎉 All images are accessible!');
      }
    } catch (error) {
      console.error('❌ Error validating images:', error);
    }
  } else {
    console.log('🖼️  IMAGE VALIDATION');
    console.log('==================');
    console.log('To validate image URLs, run with: --validate-images');
    console.log('(Note: This requires internet connection and may be slow)');
  }

  console.log('\n✨ Validation complete!');
}

main().catch(console.error);