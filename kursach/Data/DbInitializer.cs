using kursach.Models;
using System.Linq;

namespace kursach.Data
{
    public static class DbInitializer
    {
        public static void Initialize(PortfContext context)
        {
            context.Database.EnsureCreated();
            if (context.Category.Any())
            {
                return;
            }
            var categories = new Category[]
            {
                new Category { Name = "Business", Url = "http://portf.net/business" },
                new Category { Name = "Cities", Url = "http://portf.net/cities" },
                new Category { Name = "Artists", Url = "http://portf.net/artists" }
            };
            foreach (Category c in categories)
            {
                context.Category.Add(c);
            }
            context.SaveChanges();

            var customers = new Customer[]
            {
                new Customer { CustomerId = 1, Name = "Администрация г. Иваново" },
                new Customer { CustomerId = 2, Name = "Газпром" }
            };
            foreach (Customer c in customers)
            {
                context.Customer.Add(c);
            }
            context.SaveChanges();

            var posts = new Post[]
            {
                new Post { CategoryId = 1, CustomerId = 1, Content = "1 вариант дизайна", Title = "1 пост" },
                new Post { CategoryId = 1, CustomerId = 2, Content = "2 вариант дизайна", Title = "2 пост" }
            };
            foreach (Post p in posts)
            {
                context.Post.Add(p);
            }
            context.SaveChanges();

            

        }
    }
}