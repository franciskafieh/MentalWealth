using Ganss.Xss;
using MentalWealth.Auth;
using MentalWealth.Data;
using MentalWealth.Realtime;
using MentalWealth.Realtime.Services;
using MentalWealth.Services;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Blog API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

builder.Services.AddSignalR();

builder.Services.AddAuth(builder.Configuration);
builder.Services.AddPersistence(builder.Configuration.GetConnectionString("DefaultConnection"));

builder.Services.AddSingleton<IConfiguration>(builder.Configuration);
builder.Services.AddSingleton<HtmlSanitizer>();
builder.Services.AddSingleton<IChatService, ChatService>();
builder.Services.AddScoped<IMoneyService, MoneyService>();
builder.Services.AddScoped<IShareService, ShareService>();

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddMemoryCache();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors(config =>
    config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.MapControllers();
app.UseWebSockets();
app.MapHub<ChatHub>("/Hubs/Chat", o =>
{
    o.Transports =
        HttpTransportType.WebSockets |
        HttpTransportType.LongPolling;
});

app.Run();