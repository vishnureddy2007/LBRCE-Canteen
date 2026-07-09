package com.lbrce.canteen.config;

import com.lbrce.canteen.entity.Admin;
import com.lbrce.canteen.entity.Announcement;
import com.lbrce.canteen.entity.Category;
import com.lbrce.canteen.entity.FoodItem;
import com.lbrce.canteen.entity.Offer;
import com.lbrce.canteen.repository.AdminRepository;
import com.lbrce.canteen.repository.AnnouncementRepository;
import com.lbrce.canteen.repository.CategoryRepository;
import com.lbrce.canteen.repository.FoodItemRepository;
import com.lbrce.canteen.repository.OfferRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

/**
 * Seeds the database with a default admin and a small but realistic demo
 * dataset on first boot. Every operation is guarded by an existence check so
 * this runner is idempotent across restarts.
 *
 * <p>The data mirrors the contents of {@code database/seed_data.sql} so the
 * app boots to a usable state without any external SQL load step. The SQL
 * file is still useful as documentation and for non-Spring tooling.</p>
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AdminRepository adminRepository;
    private final CategoryRepository categoryRepository;
    private final FoodItemRepository foodItemRepository;
    private final OfferRepository offerRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminRepository adminRepository,
                           CategoryRepository categoryRepository,
                           FoodItemRepository foodItemRepository,
                           OfferRepository offerRepository,
                           AnnouncementRepository announcementRepository,
                           PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.categoryRepository = categoryRepository;
        this.foodItemRepository = foodItemRepository;
        this.offerRepository = offerRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Admin admin = seedAdmin();
        List<Category> categories = seedCategories();
        seedFood(categories);
        seedOffers();
        seedAnnouncements(admin);
    }

    private Admin seedAdmin() {
        Optional<Admin> existing = adminRepository.findByUsernameOrEmail("vishnureddy@gmail.com", "vishnureddy@gmail.com");
        if (existing.isPresent()) {
            Admin a = existing.get();
            a.setPasswordHash(passwordEncoder.encode("Bunny@07"));
            a.setFullName("Canteen Administrator");
            a.setRole("ADMIN");
            Admin saved = adminRepository.save(a);
            log.info("Reset/verified default admin credentials: vishnureddy@gmail.com / Bunny@07");
            return saved;
        } else {
            Admin a = new Admin();
            a.setUsername("vishnureddy@gmail.com");
            a.setEmail("vishnureddy@gmail.com");
            a.setPasswordHash(passwordEncoder.encode("Bunny@07"));
            a.setFullName("Canteen Administrator");
            a.setPhone("9876543210");
            a.setRole("ADMIN");
            Admin saved = adminRepository.save(a);
            log.info("Seeded default admin: vishnureddy@gmail.com / Bunny@07");
            return saved;
        }
    }

    private List<Category> seedCategories() {
        if (categoryRepository.count() > 0) {
            return categoryRepository.findAll();
        }
        List<Category> cats = List.of(
                makeCategory("Breakfast", 1),
                makeCategory("Lunch",     2),
                makeCategory("Snacks",    3),
                makeCategory("Beverages", 4)
        );
        categoryRepository.saveAll(cats);
        log.info("Seeded {} categories", cats.size());
        return cats;
    }

    private void seedFood(List<Category> cats) {
        if (foodItemRepository.count() > 0) {
            return;
        }
        Category breakfast = cats.get(0);
        Category lunch     = cats.get(1);
        Category snacks    = cats.get(2);
        Category beverages = cats.get(3);

        List<FoodItem> items = List.of(
                makeFood("Idli with Sambar",   "Soft steamed idlis served with hot sambar and coconut chutney.", new BigDecimal("30.00"),  breakfast),
                makeFood("Poori with Curry",   "Crispy pooris served with potato curry and pickle.",             new BigDecimal("40.00"),  breakfast),
                makeFood("Upma",               "Semolina cooked with mustard, curry leaves and vegetables.",     new BigDecimal("25.00"),  breakfast),
                makeFood("Veg Biryani",        "Fragrant basmati rice cooked with mixed vegetables and spices.", new BigDecimal("90.00"),  lunch),
                makeFood("Chicken Biryani",    "Long-grain rice layered with marinated chicken and spices.",     new BigDecimal("120.00"), lunch),
                makeFood("Veg Fried Rice",     "Indo-Chinese style fried rice with crisp vegetables.",           new BigDecimal("80.00"),  lunch),
                makeFood("Meals (Thali)",      "Full South Indian thali - rice, dal, sambar, rasam, curries.",  new BigDecimal("110.00"), lunch),
                makeFood("Samosa",             "Crispy pastry filled with spiced potatoes and peas.",             new BigDecimal("15.00"),  snacks),
                makeFood("Vada Pav",           "Mumbai style spicy potato vada in a pav bun.",                   new BigDecimal("20.00"),  snacks),
                makeFood("Masala Maggi",       "Quick noodles tossed with onion, capsicum and special masala.",  new BigDecimal("35.00"),  snacks),
                makeFood("Filter Coffee",      "Traditional South Indian filter coffee in a steel davara.",     new BigDecimal("20.00"),  beverages),
                makeFood("Masala Chai",        "Hot spiced tea with milk - perfect refresher.",                   new BigDecimal("15.00"),  beverages),
                makeFood("Fresh Lime Soda",    "Refreshing lime soda - sweet, salty or mixed.",                  new BigDecimal("25.00"),  beverages),
                makeFood("Mango Lassi",        "Thick yogurt drink blended with ripe mango pulp.",               new BigDecimal("40.00"),  beverages)
        );
        foodItemRepository.saveAll(items);
        log.info("Seeded {} food items", items.size());
    }

    private void seedOffers() {
        if (offerRepository.count() > 0) {
            return;
        }
        Instant now = Instant.now();
        offerRepository.saveAll(List.of(
                makeOffer("Monsoon Special",
                        "10% off on all hot beverages every evening.",
                        new BigDecimal("10.00"), now, now.plus(30, ChronoUnit.DAYS)),
                makeOffer("Combo Meal",
                        "Get a samosa + chai for just Rs.25.",
                        new BigDecimal("15.00"), now, now.plus(14, ChronoUnit.DAYS))
        ));
        log.info("Seeded 2 offers");
    }

    private void seedAnnouncements(Admin admin) {
        if (announcementRepository.count() > 0) {
            return;
        }
        Instant now = Instant.now();
        announcementRepository.saveAll(List.of(
                makeAnnouncement("Welcome to LBRCE Canteen!",
                        "Browse the menu, place orders online and skip the queue. Cash on pickup or simulated UPI supported.",
                        now, now.plus(90, ChronoUnit.DAYS), admin),
                makeAnnouncement("New Lunch Menu",
                        "Try our new Veg Biryani and Chicken Biryani - freshly prepared every day.",
                        now, now.plus(60, ChronoUnit.DAYS), admin)
        ));
        log.info("Seeded 2 announcements");
    }

    private static Category makeCategory(String name, int order) {
        Category c = new Category();
        c.setName(name);
        c.setDisplayOrder(order);
        c.setActive(true);
        return c;
    }

    private static FoodItem makeFood(String name, String desc, BigDecimal price, Category c) {
        FoodItem f = new FoodItem();
        f.setName(name);
        f.setDescription(desc);
        f.setPrice(price);
        f.setCategory(c);
        f.setAvailable(true);
        f.setRatingAvg(BigDecimal.ZERO);
        f.setRatingCount(0);
        return f;
    }

    private static Offer makeOffer(String title, String desc, BigDecimal discount, Instant from, Instant to) {
        Offer o = new Offer();
        o.setTitle(title);
        o.setDescription(desc);
        o.setDiscountPercent(discount);
        o.setActive(true);
        o.setValidFrom(from);
        o.setValidTo(to);
        return o;
    }

    private static Announcement makeAnnouncement(String title, String body, Instant from, Instant to, Admin createdBy) {
        Announcement a = new Announcement();
        a.setTitle(title);
        a.setBody(body);
        a.setActive(true);
        a.setStartsAt(from);
        a.setEndsAt(to);
        a.setCreatedBy(createdBy);
        return a;
    }
}