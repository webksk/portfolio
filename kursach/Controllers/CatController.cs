using kursach.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace kursach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class CatController : ControllerBase
    {
        private readonly PortfContext _context;
        public CatController(PortfContext context)
        {
            _context = context;
            //Заполнение, если пусто
            if (_context.Category.Count() == 0)
            {
                _context.Category.Add(new Category
                {
                    Name = "Commerce", 
                    Url = "com"
                });
                _context.SaveChanges();
            }
        }

        //Вывод всех категорий и постов
        [HttpGet]
        public IEnumerable<Category> GetAll()
        {
            return _context.Category.Include(p => p.Post);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var category = await _context.Category.SingleOrDefaultAsync(m => m.CategoryId == id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }

        //Создание категории с постом
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Category category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Post p = category.Post.FirstOrDefault();

           _context.Category.Add(category);
            _context.Post.Add(p);

            await _context.SaveChangesAsync();
            return CreatedAtAction("GetCategory", new { id = category.CategoryId }, category);
        }

        //Редактированиеы
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Category category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var item = _context.Category.Find(id);
            if (item == null)
            {
                return NotFound();
            }

            item.Url = category.Url;
            item.Name = category.Name;

            _context.Category.Update(item);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        //Удаление доступно только для админа
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = _context.Category.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            _context.Category.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}