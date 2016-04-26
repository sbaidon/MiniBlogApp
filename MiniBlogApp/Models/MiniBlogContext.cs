using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace MiniBlogApp.Models
{
    public class MiniBlogContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }

        public DbSet<Page> Pages { get; set; }
    }
}