using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using RL.Data;
using RL.Data.DataModels;

namespace RL.Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class UserPlanProcedureController : ControllerBase
{
    private readonly ILogger<UserPlanProcedureController> _logger;
    private readonly RLContext _context;

    public UserPlanProcedureController(ILogger<UserPlanProcedureController> logger, RLContext context)
    {
        _logger = logger;
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    [HttpGet]
    [EnableQuery]
    public IEnumerable<UserPlanProcedure> Get()
    {
        return _context.UserPlanProcedures;
    }
}
