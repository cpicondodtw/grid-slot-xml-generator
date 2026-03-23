import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { ConfigForm, SelectOption } from "../types";
import { getInputClass } from "../utils/validation";

const MANUAL_SHEET_TAB_VALUE = "__manual__";

type Props = {
  config: ConfigForm;
  sheetTabs: SelectOption[];
  sheetTabsLoading: boolean;
  sheetTabsError: string | null;
  contextOptions: SelectOption[];
  contextOptionsLoading: boolean;
  contextOptionsError: string | null;
  setConfig: Dispatch<SetStateAction<ConfigForm>>;
};

export default function SlotConfigurationForm({
  config,
  sheetTabs,
  sheetTabsLoading,
  sheetTabsError,
  contextOptions,
  contextOptionsLoading,
  contextOptionsError,
  setConfig,
}: Props) {
  const contextOptionsListId = `slot-context-id-options-${config.sheetTab || "empty"}`;
  const isManualEntryMode = config.sheetTab === MANUAL_SHEET_TAB_VALUE;

  const updateConfig = <K extends keyof ConfigForm>(key: K, value: ConfigForm[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle>Slot Configuration</CardTitle>
        <p className="text-sm text-slate-400">
          Section where to add the values for the setup of the content slot for category.
        </p>
      </CardHeader>

      

      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="slot-sheet-tab">Brand site</Label>
          <select
            id="slot-sheet-tab"
            value={config.sheetTab}
            onChange={(e) => updateConfig("sheetTab", e.target.value)}
            className={`h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm ${getInputClass(config.sheetTab)}`}
            disabled={sheetTabsLoading || !!sheetTabsError}
          >
            <option value={MANUAL_SHEET_TAB_VALUE}>Manual entry</option>
            <option value="">{sheetTabsLoading ? "Loading tabs..." : "Select a sheet tab"}</option>
            {sheetTabs.map((option) => (
              <option key={option.value} value={option.value}>
                - {option.label}
              </option>
            ))}
            
          </select>
          <p className="text-xs text-slate-400">Select a brand site or use Manual entry to type a custom Category ID.</p>
          {sheetTabsError && <p className="text-xs text-red-500">{sheetTabsError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slot-id">Slot ID</Label>
          <Input
            id="slot-id"
            value={config.slotId}
            placeholder="cat-grid-slot1"
            onChange={(e) => updateConfig("slotId", e.target.value)}
            className={getInputClass(config.slotId)}
          />
          <p className="text-xs text-slate-400">Slot ID identifier where the content asset will appear.</p>
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="slot-context">Context</Label>
          <Input
            id="slot-context"
            value={config.context}
            placeholder="category"
            onChange={(e) => updateConfig("context", e.target.value)}
            className={getInputClass(config.context)}
          />
          <p className="text-xs text-slate-400">Set to the type of page context, such as category.</p>
        </div> */}

        

        <div className="space-y-2">
          <Label htmlFor="slot-context-id">Category ID</Label>
          <Input
            id="slot-context-id"
            value={config.contextId}
            list={contextOptionsListId}
            placeholder={
              !config.sheetTab
                ? "Select a sheet tab first"
                : isManualEntryMode
                  ? "Type a custom category ID"
                : contextOptionsLoading
                  ? "Loading category IDs..."
                  : "Type or select a category ID"
            }
            onChange={(e) => updateConfig("contextId", e.target.value)}
            autoComplete="off"
            className={getInputClass(config.contextId)}
            disabled={(!config.sheetTab || contextOptionsLoading || !!contextOptionsError) && !isManualEntryMode}
          />
          {!isManualEntryMode && (
            <datalist id={contextOptionsListId}>
              {contextOptions.map((option) => (
                <option key={option.value} value={option.value} label={option.label} />
              ))}
            </datalist>
          )}
          <p className="text-xs text-slate-400">
            {isManualEntryMode
              ? "Manual entry is enabled. Type any category ID."
              : "Type to filter suggestions or pick a category ID from the selected Google Sheet tab."}
          </p>
          {contextOptionsError && config.sheetTab && !isManualEntryMode && (
            <p className="text-xs text-red-500">{contextOptionsError}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="slot-configuration-id">Configuration ID</Label>
          <Input
            id="slot-configuration-id"
            value={config.configurationId}
            placeholder="260325_25_with_100_offer_1_ff-grid_banner"
            onChange={(e) => updateConfig("configurationId", e.target.value)}
            className={getInputClass(config.configurationId)}
          />
          <p className="text-xs text-slate-400">Auto generate value from File Naming. But, user needs to add the asset name</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="slot-description">Description</Label>
          <Textarea
            id="slot-description"
            value={config.description}
            placeholder="Rank 40 | Mar 25 - 31, 2026 @12am | 25% with 100€ | Mar 11, 2026"
            onChange={(e) => updateConfig("description", e.target.value)}
            rows={2}
            className={getInputClass(config.description)}
          />
          <p className="text-xs text-slate-400">Internal description to help identify the timing, offer, or usage of this slot setup.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slot-template">Template</Label>
          <Input
            id="slot-template"
            value={config.template}
            placeholder="slots/content/contentassetbody.isml"
            onChange={(e) => updateConfig("template", e.target.value)}
            className={getInputClass(config.template)}
          />
          <p className="text-xs text-slate-400">Template file used to render the assigned content asset.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slot-context">Context</Label>
          <Input
            id="slot-context"
            value={config.context}
            placeholder="category"
            onChange={(e) => updateConfig("context", e.target.value)}
            className={getInputClass(config.context)}
          />
          <p className="text-xs text-slate-400">Set to the type of page context, such as category.</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="slot-content-asset-id">Content Asset ID</Label>
          <Input
            id="slot-content-asset-id"
            value={config.contentAssetId}
            placeholder="260325_25_with_100_offer_1_ff-grid_banner"
            onChange={(e) => updateConfig("contentAssetId", e.target.value)}
            className={getInputClass(config.contentAssetId)}
          />
          <p className="text-xs text-slate-400">Content asset that will be inserted into this slot configuration.</p>
        </div>

        <div className="flex items-center justify-between rounded-2xl border p-4">
          <div className="pr-4">
            <p className="font-medium">Assigned to site</p>
            <p className="text-xs text-slate-400">true - the slot configuration is assigned directly to the site. </p>
            <p className="text-xs text-slate-400">false - the slot reusable across multiple sites.</p>
          </div>
          <Switch
            checked={config.assignedToSite}
            onCheckedChange={(checked) => updateConfig("assignedToSite", checked)}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border p-4 space-y-2 ">
          <div className="pr-4">
            <p className="font-medium">Enabled flag</p>
            <p className="text-xs text-slate-400">Turn this on to include the slot configuration as enabled in the XML.</p>
          </div>
          <Switch
            checked={config.enabledFlag}
            onCheckedChange={(checked) => updateConfig("enabledFlag", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
