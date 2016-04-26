using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MiniBlogApp.Models
{
    public class Page
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public DateTime Date { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public string Author { get; set; }
        
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }


    }
}