using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalWealth.Migrations
{
    /// <inheritdoc />
    public partial class AddedBalanceToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsHelper",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "Balance",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Balance",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<bool>(
                name: "IsHelper",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
