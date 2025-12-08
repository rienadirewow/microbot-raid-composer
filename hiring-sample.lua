-- Hire 3 comps from char you playing first, then lites then rest of the comps
  
  local presets = {
    -- Preset 1
    ["mc"] = {
        -- Group 1
        ".z addinvite holymana t5r warrior tank default human",
        ".z addinvite tigerbow t4r hunter rangedps default nightelf",
        ".z addinvite holymoon t4r rogue meleedps default human",
        -- Group 2
        ".z addinvite holymana t5r warrior tank default human",
        ".z addinvite tigerbow t4r hunter rangedps default nightelf",
        ".z addinvite holymoon t4r warrior meleedps default human",
        ".z addinvite security t4r warrior meleedps default human",
        -- Group 3
        ".z addinvite holymana t5r warrior tank default human",
        ".z addinvite tigerbow t4r hunter rangedps default nightelf",
        ".z addinvite holymoon t4r warrior meleedps default human",
        ".z addinvite security t4r warrior meleedps default human",
        -- Group 4
        ".z addinvite holymana t5r warrior tank default human",
        ".z addinvite tigerbow t4r hunter rangedps default nightelf",
        ".z addinvite holymoon t4r warrior meleedps default human",
        ".z addinvite security t4r warrior meleedps default human",        
        -- Group 5
        ".z addinvite holynova t4r priest healer default dwarf",
        ".z addinvite holyfreeze t4r paladin healer default dwarf",
        ".z addinvite holybow t2r mage rangedps default gnome",
        ".z addinvite holystones t2r warlock rangedps default gnome",
        -- Group 6
        ".z addinvite holynova t4r priest healer default dwarf",
        ".z addinvite holyfreeze t4r paladin healer default dwarf",
        ".z addinvite holybow t2r mage rangedps default gnome",
        ".z addinvite holystones t2r warlock rangedps default gnome",
        -- Group 7
        ".z addinvite holynova t4r priest healer default dwarf",
        ".z addinvite holyfreeze t4r paladin healer default dwarf",
        ".z addinvite holybow t2r mage rangedps default gnome",
        ".z addinvite holystones t2r warlock rangedps default gnome",
        -- Group 8
        ".z addinvite holynova t4r priest healer default dwarf",
        ".z addinvite holyfreeze t4r druid healer default nightelf",
        ".z addinvite holybow t2r mage rangedps default gnome",
        ".z addinvite holystones t2r warlock rangedps default gnome",
    },
    -- Preset 2
    ["bwl"] = {
        ".z add rogue dps",
        ".z add mage dps",
    },
    -- Preset 3
    ["aq40"] = {
        ".z add rogue dps",
        ".z add mage dps",
    },
    -- Preset 4
    ["naxx"] = {
        ".z add rogue dps",
        ".z add mage dps",
    },
    -- Preset 5
    ["zg"] = {
        ".z add rogue dps",
        ".z add mage dps",
    },
    -- Preset 6
    ["ony"] = {
        ".z add rogue dps",
        ".z add mage dps",
    },
}

local function countTableElements(tbl)
    local count = 0
    for _ in pairs(tbl) do count = count + 1 end
    return count
end

function hire(preset)
    local commands = presets[string.lower(preset)]
    if not commands then
        print("Preset for " .. preset .. " not found.")
        return
    end

    local delay = 500  -- Set Delay
    local index = 0
    local elapsed = 0
    local totalCommands = countTableElements(commands)

    local indicatorFrame = CreateFrame("Frame", nil, UIParent)
    indicatorFrame:SetScript("OnUpdate", function(self)

        elapsed = elapsed + 1        
        if elapsed >= delay or index == 0 then
            index = index + 1

            if index <= totalCommands then
                SendChatMessage(elapsed)
                SendChatMessage(commands[index])
                elapsed = 0
            else
                indicatorFrame:SetScript("OnUpdate", nil)
            end
        end
    end)
end

