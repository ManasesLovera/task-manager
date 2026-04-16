namespace TaskManager.Api.DTOs.Analytics;

public class DashboardAnalyticsResponse
{
    public List<TechnicianPerformance> TechnicianPerformances { get; set; } = new();
}

public class TechnicianPerformance
{
    public string TechnicianId { get; set; } = string.Empty;
    public string TechnicianName { get; set; } = string.Empty;
    public int ResolvedTicketsCount { get; set; }
}
