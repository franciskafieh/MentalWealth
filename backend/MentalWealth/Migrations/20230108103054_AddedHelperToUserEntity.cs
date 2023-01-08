using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalWealth.Migrations
{
    /// <inheritdoc />
    public partial class AddedHelperToUserEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsHelper",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsHelper",
                table: "AspNetUsers");
        }
    }
}
