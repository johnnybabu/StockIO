using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Projects;
using Projects.Entities.Membership;
using Projects.Data;
using Projects.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Test
{
    class EmployeesServicesTest
    {
        private IMembershipService _membershipService;
        private IUnitOfWork _unitOfWork;
        private List<tbl_user> _users;
        private IEntityBaseRepository<tbl_user> _usersRepository;
        private DBConnect _dbEntities;
    }
}
