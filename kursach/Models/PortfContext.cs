using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace kursach.Models
{
    public partial class PortfContext : IdentityDbContext<User>
    {
        #region Constructor
        public PortfContext(DbContextOptions<PortfContext>
       options)
        : base(options)
        { }
        #endregion
        
        public virtual DbSet<Category> Category { get; set; }
        public virtual DbSet<Post> Post { get; set; }
        public virtual DbSet<Customer> Customer { get; set; }

        protected override void OnModelCreating(ModelBuilder
       modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(e => e.Url).IsRequired();
                entity.Property(e => e.CategoryId).IsRequired();
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.Property(e => e.CustomerId).IsRequired();

            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.Property(e => e.PostId).IsRequired();
                entity.Property(e => e.CustomerId).IsRequired();
                entity.Property(e => e.CategoryId).IsRequired();

                entity.HasOne(d => d.Category)
                .WithMany(p => p.Post)
                .HasForeignKey(d => d.CategoryId);

                entity.HasOne(c => c.Customer)
                .WithMany(p => p.Post)
                .HasForeignKey(c => c.CustomerId);
            });
        }
    }
}
