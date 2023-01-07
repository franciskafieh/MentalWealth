using AutoMapper;
using MentalWealth.Data.Entities;
using MentalWealth.Data.Models.Requests;
using MentalWealth.Data.Models.Responses;

namespace MentalWealth.MappingProfiles;

public class JournalEntryProfile : Profile
{
    public JournalEntryProfile()
    {
        CreateMap<JournalCreateRequest, JournalEntry>();
        CreateMap<JournalUpdateRequest, JournalEntry>();

        CreateMap<JournalEntry, JournalIndexResponse>();
        CreateMap<JournalEntry, JournalViewResponse>();
        CreateMap<JournalEntry, JournalCreateResponse>();
    }
}