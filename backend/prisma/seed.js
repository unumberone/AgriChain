const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.analytics.deleteMany(),
    prisma.donation.deleteMany(),
    prisma.crowdfundingCampaign.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.communityPost.deleteMany(),
    prisma.productionCost.deleteMany(),
    prisma.order.deleteMany(),
    prisma.productListing.deleteMany(),
    prisma.product.deleteMany(),
    prisma.farmingPractice.deleteMany(),
    prisma.farm.deleteMany(),
    prisma.farmer.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.location.deleteMany(),
  ]);

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        state: 'Maharashtra',
        district: 'Pune',
        pincode: '411001',
        coordinates: { lat: 18.5204, lng: 73.8567 }
      }
    }),
    prisma.location.create({
      data: {
        state: 'Karnataka',
        district: 'Bengaluru Rural',
        pincode: '562149',
        coordinates: { lat: 13.0827, lng: 77.5877 }
      }
    })
  ]);

  // Create farmers
  const farmers = await Promise.all([
    prisma.farmer.create({
      data: {
        name: 'Rajesh Kumar',
        contactNumber: '+91-9876543210',
        email: 'rajesh.kumar@example.com',
        locationId: locations[0].id,
        blockchainIdentity: '0x1234567890abcdef',
        registrationDate: new Date('2023-01-15')
      }
    }),
    prisma.farmer.create({
      data: {
        name: 'Priya Sharma',
        contactNumber: '+91-9876543211',
        email: 'priya.sharma@example.com',
        locationId: locations[1].id,
        blockchainIdentity: '0xabcdef1234567890',
        registrationDate: new Date('2023-02-01')
      }
    })
  ]);

  // Create farms
  const farms = await Promise.all([
    prisma.farm.create({
      data: {
        farmerId: farmers[0].id,
        name: 'Green Valley Organics',
        sizeHectares: 5.5,
        isOrganic: true,
        certificationDetails: { certifier: 'IndiaOrganic', certificationDate: '2023-03-15' }
      }
    }),
    prisma.farm.create({
      data: {
        farmerId: farmers[1].id,
        name: 'Sunshine Farms',
        sizeHectares: 3.2,
        isOrganic: false,
        certificationDetails: null
      }
    })
  ]);

  // Create farming practices
  await Promise.all([
    prisma.farmingPractice.create({
      data: {
        farmId: farms[0].id,
        practiceType: 'Crop Rotation',
        description: 'Three-year rotation cycle with legumes',
        verificationStatus: 'verified',
        verifiedAt: new Date('2023-04-01')
      }
    }),
    prisma.farmingPractice.create({
      data: {
        farmId: farms[1].id,
        practiceType: 'Integrated Pest Management',
        description: 'Natural pest control methods',
        verificationStatus: 'pending',
        verifiedAt: null
      }
    })
  ]);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        farmId: farms[0].id,
        name: 'Organic Tomatoes',
        category: 'Vegetables',
        description: 'Fresh organic tomatoes',
        productionDate: new Date('2024-02-01'),
        blockchainReference: '0xtomatoes123'
      }
    }),
    prisma.product.create({
      data: {
        farmId: farms[1].id,
        name: 'Fresh Mangoes',
        category: 'Fruits',
        description: 'Alphonso mangoes',
        productionDate: new Date('2024-02-15'),
        blockchainReference: '0xmangoes456'
      }
    })
  ]);

  // Create product listings
  const listings = await Promise.all([
    prisma.productListing.create({
      data: {
        productId: products[0].id,
        farmerId: farmers[0].id,
        quantityAvailable: 100.0,
        recommendedPrice: 50.0,
        actualPrice: 45.0,
        status: 'active',
        unit: 'kg'
      }
    }),
    prisma.productListing.create({
      data: {
        productId: products[1].id,
        farmerId: farmers[1].id,
        quantityAvailable: 50.0,
        recommendedPrice: 200.0,
        actualPrice: 180.0,
        status: 'active',
        unit: 'dozen'
      }
    })
  ]);

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Amit Patel',
        email: 'amit.patel@example.com',
        contactNumber: '+91-9876543212',
        blockchainIdentity: '0xcustomer123'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@example.com',
        contactNumber: '+91-9876543213',
        blockchainIdentity: '0xcustomer456'
      }
    })
  ]);

  // Create orders
  await Promise.all([
    prisma.order.create({
      data: {
        customerId: customers[0].id,
        farmerId: farmers[0].id,
        listingId: listings[0].id,
        quantity: 10.0,
        totalAmount: 450.0,
        status: 'completed',
        blockchainTransactionId: '0xorder123',
        orderDate: new Date('2024-02-10')
      }
    }),
    prisma.order.create({
      data: {
        customerId: customers[1].id,
        farmerId: farmers[1].id,
        listingId: listings[1].id,
        quantity: 2.0,
        totalAmount: 360.0,
        status: 'processing',
        blockchainTransactionId: '0xorder456',
        orderDate: new Date('2024-02-20')
      }
    })
  ]);

  // Create production costs
  await Promise.all([
    prisma.productionCost.create({
      data: {
        productId: products[0].id,
        costType: 'Seeds',
        amount: 1000.0,
        description: 'Organic tomato seeds'
      }
    }),
    prisma.productionCost.create({
      data: {
        productId: products[1].id,
        costType: 'Fertilizer',
        amount: 2000.0,
        description: 'Natural fertilizers'
      }
    })
  ]);

  // Create community posts
  const posts = await Promise.all([
    prisma.communityPost.create({
      data: {
        authorId: farmers[0].id,
        title: 'Organic Farming Tips',
        content: 'Here are some effective organic farming techniques...',
        category: 'Education'
      }
    }),
    prisma.communityPost.create({
      data: {
        authorId: farmers[1].id,
        title: 'Market Prices Update',
        content: 'Current market trends for fruits...',
        category: 'Market'
      }
    })
  ]);

  // Create comments
  await Promise.all([
    prisma.comment.create({
      data: {
        postId: posts[0].id,
        authorId: customers[0].id,
        authorType: 'customer',
        content: 'Very helpful information!'
      }
    }),
    prisma.comment.create({
      data: {
        postId: posts[1].id,
        authorId: customers[1].id,
        authorType: 'customer',
        content: 'Thanks for the market update'
      }
    })
  ]);

  // Create crowdfunding campaigns
  const campaigns = await Promise.all([
    prisma.crowdfundingCampaign.create({
      data: {
        farmerId: farmers[0].id,
        title: 'Expand Organic Farm',
        description: 'Help us expand our organic farming operations',
        targetAmount: 100000.0,
        currentAmount: 25000.0,
        status: 'active',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30')
      }
    }),
    prisma.crowdfundingCampaign.create({
      data: {
        farmerId: farmers[1].id,
        title: 'New Irrigation System',
        description: 'Modern irrigation system installation',
        targetAmount: 50000.0,
        currentAmount: 15000.0,
        status: 'active',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-05-31')
      }
    })
  ]);

  // Create donations
  await Promise.all([
    prisma.donation.create({
      data: {
        campaignId: campaigns[0].id,
        donorId: customers[0].id,
        amount: 5000.0,
        blockchainTransactionId: '0xdonation123'
      }
    }),
    prisma.donation.create({
      data: {
        campaignId: campaigns[1].id,
        donorId: customers[1].id,
        amount: 3000.0,
        blockchainTransactionId: '0xdonation456'
      }
    })
  ]);

  // Create analytics
  await Promise.all([
    prisma.analytics.create({
      data: {
        farmerId: farmers[0].id,
        metricType: 'sales',
        metricValue: { 
          totalSales: 45000,
          averageOrderValue: 450,
          customerSatisfaction: 4.8
        }
      }
    }),
    prisma.analytics.create({
      data: {
        farmerId: farmers[1].id,
        metricType: 'production',
        metricValue: {
          totalProduction: 5000,
          wastage: 2.5,
          efficiency: 0.95
        }
      }
    })
  ]);