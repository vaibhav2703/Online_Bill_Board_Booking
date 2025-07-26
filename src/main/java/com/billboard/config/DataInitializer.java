package com.billboard.config;

import com.billboard.entity.Billboard;
import com.billboard.repository.BillboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private BillboardRepository billboardRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (billboardRepository.count() == 0) {
            // Create sample billboards
            Billboard billboard1 = new Billboard(
                "Times Square Billboard",
                "Times Square, New York, NY 10036",
                40.7580,
                -73.9855,
                "48x14 feet",
                500.0,
                "Premium location in Times Square with high visibility",
                null
            );
            
            Billboard billboard2 = new Billboard(
                "Downtown LA Billboard",
                "Downtown Los Angeles, CA 90012",
                34.0522,
                -118.2437,
                "32x10 feet",
                300.0,
                "Great exposure in downtown Los Angeles",
                null
            );
            
            Billboard billboard3 = new Billboard(
                "Chicago Loop Billboard",
                "The Loop, Chicago, IL 60601",
                41.8781,
                -87.6298,
                "40x12 feet",
                400.0,
                "High traffic area in Chicago's business district",
                null
            );
            
            Billboard billboard4 = new Billboard(
                "Miami Beach Billboard",
                "Miami Beach, FL 33139",
                25.7617,
                -80.1918,
                "36x12 feet",
                350.0,
                "Popular tourist destination with beach views",
                null
            );
            
            Billboard billboard5 = new Billboard(
                "Las Vegas Strip Billboard",
                "Las Vegas Strip, NV 89109",
                36.1699,
                -115.1398,
                "50x16 feet",
                600.0,
                "Prime location on the famous Las Vegas Strip",
                null
            );
            
            Billboard billboard6 = new Billboard(
                "San Francisco Bay Area Billboard",
                "San Francisco, CA 94102",
                37.7749,
                -122.4194,
                "38x11 feet",
                450.0,
                "Tech hub with high-income demographics",
                null
            );
            
            billboardRepository.save(billboard1);
            billboardRepository.save(billboard2);
            billboardRepository.save(billboard3);
            billboardRepository.save(billboard4);
            billboardRepository.save(billboard5);
            billboardRepository.save(billboard6);
            
            System.out.println("Sample billboard data initialized!");
        }
    }
}