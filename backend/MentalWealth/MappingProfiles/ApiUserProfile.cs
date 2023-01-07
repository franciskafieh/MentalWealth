using AutoMapper;
using MentalWealth.Data.Entities;
using MentalWealth.Data.Models.Requests;
using MentalWealth.Data.Models.Responses;

namespace MentalWealth.MappingProfiles;

public class ApiUserProfile : Profile
{
    public ApiUserProfile()
    {
        CreateMap<RegisterRequest, ApiUser>();

        CreateMap<ApiUser, LoginResponseUser>();
        CreateMap<ApiUser, UserResponse>();
    }
}