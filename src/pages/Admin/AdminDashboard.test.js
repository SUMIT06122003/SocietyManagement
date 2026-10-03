import { buildRoomGrid } from "./AdminDashboard";

describe("buildRoomGrid", () => {
  it("creates 10 floors with 4 rooms each in the expected numbering pattern", () => {
    const grid = buildRoomGrid();

    expect(grid).toHaveLength(10);
    expect(grid[0].floor).toBe(1);
    expect(grid[0].rooms).toEqual([101, 102, 103, 104]);
    expect(grid[1].rooms).toEqual([201, 202, 203, 204]);
    expect(grid[9].rooms).toEqual([1001, 1002, 1003, 1004]);
  });
});
