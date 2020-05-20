declare module "api/time" {
    import dayjs, { Dayjs } from 'dayjs';
    import { DataChartTime, DataChartTimeLevelDate, ChartTimeDate, ScrollTypeHorizontal, Period, ChartCalendarLevel, ChartCalendarFormat } from "gstc";
    import DeepState from 'deep-state-observer';
    import { Api } from "api/api";
    export interface CurrentDate {
        timestamp: number;
        hour: Dayjs;
        day: Dayjs;
        week: Dayjs;
        month: Dayjs;
        year: Dayjs;
    }
    export class Time {
        private locale;
        private utcMode;
        private state;
        private api;
        dayjs: typeof dayjs;
        currentDate: CurrentDate;
        constructor(state: DeepState, api: Api);
        private resetCurrentDate;
        date(time?: number | string | Date | undefined): dayjs.Dayjs;
        private addAdditionalSpace;
        recalculateFromTo(time: DataChartTime): DataChartTime;
        getCenter(time: DataChartTime): number;
        getGlobalOffsetPxFromDates(date: Dayjs, time?: DataChartTime): number;
        getViewOffsetPxFromDates(date: Dayjs, limitToView?: boolean, time?: DataChartTime): number;
        limitOffsetPxToView(x: number, time?: DataChartTime): number;
        findDateAtOffsetPx(offsetPx: number, allPeriodDates: ChartTimeDate[]): ChartTimeDate | undefined;
        findDateAtTime(milliseconds: number, allPeriodDates: ChartTimeDate[]): ChartTimeDate | undefined;
        getTimeFromViewOffsetPx(offsetPx: number, time: DataChartTime, snapToStartOf?: boolean): number;
        calculateScrollPosPxFromTime(milliseconds: number, time: DataChartTime | undefined, scroll: ScrollTypeHorizontal | undefined): number;
        getCurrentFormatForLevel(level: ChartCalendarLevel, time: DataChartTime): ChartCalendarFormat;
        generatePeriodDates({ leftDate, rightDate, period, level, levelIndex, time, callOnDate, callOnLevelDates, }: {
            leftDate: Dayjs;
            rightDate: Dayjs;
            period: Period;
            level: ChartCalendarLevel;
            levelIndex: number;
            time: DataChartTime;
            callOnDate: boolean;
            callOnLevelDates: boolean;
        }): DataChartTimeLevelDate[];
        getDatesDiffPx(fromTime: Dayjs, toTime: Dayjs, time: DataChartTime, accurate?: boolean): number;
        getLeftViewDate(time?: DataChartTime): ChartTimeDate | null;
        getRightViewDate(time?: DataChartTime): ChartTimeDate | null;
        getLowerPeriod(period: Period): Period;
        getHigherPeriod(period: Period): Period;
    }
}
declare module "api/slots" {
    import { Vido } from "gstc";
    import { Slots as VidoSlots } from "../node_modules/@neuronet.io/vido/src/Slots";
    import { ComponentInstance, Component } from '@neuronet.io/vido/types/vido.d';
    export type SlotInstances = {
        [key: string]: ComponentInstance[];
    };
    export interface SlotStorage {
        [key: string]: Component[];
    }
    export class Slots extends VidoSlots {
        private name;
        private subs;
        constructor(name: string, vido: Vido, props: unknown);
        destroy(): void;
        getName(): string;
    }
    export function generateSlots(name: string, vido: Vido, props: unknown): Slots;
}
declare module "api/api" {
    import { Time } from "api/time";
    import DeepState from 'deep-state-observer';
    import dayjs from 'dayjs';
    import { Config, DataChartTime, ScrollTypeHorizontal, Row, Item, Vido, Items, ScrollTypeVertical, Rows } from "gstc";
    import { generateSlots } from "api/slots";
    import { lithtml } from "../node_modules/@neuronet.io/vido/src/vido";
    export function getClass(name: string, appendix?: string): string;
    export function getId(name: string, id: string): string;
    export function prepareState(userConfig: Config): {
        config: any;
    };
    export function stateFromConfig(userConfig: Config): any;
    export function wasmStateFromConfig(userConfig: Config, wasmFile?: string): Promise<any>;
    export const publicApi: {
        name: string;
        stateFromConfig: typeof stateFromConfig;
        wasmStateFromConfig: typeof wasmStateFromConfig;
        merge: typeof import("@neuronet.io/vido/src/helpers").mergeDeep;
        lithtml: typeof lithtml;
        date(time: any): dayjs.Dayjs;
        setPeriod(period: dayjs.OpUnitType): number;
        dayjs: typeof dayjs;
    };
    export interface WheelResult {
        x: number;
        y: number;
        z: number;
        event: MouseWheelEvent;
    }
    export interface IconsCache {
        [key: string]: string;
    }
    export type Unsubscribes = (() => void)[];
    export class Api {
        name: string;
        debug: boolean;
        state: DeepState;
        time: Time;
        vido: Vido;
        private iconsCache;
        private unsubscribes;
        constructor(state: DeepState);
        setVido(Vido: Vido): void;
        log(...args: any[]): void;
        generateSlots: typeof generateSlots;
        mergeDeep: typeof import("@neuronet.io/vido/src/helpers").mergeDeep;
        getClass: typeof getClass;
        getId: typeof getId;
        allActions: any[];
        getActions(name: string): any;
        isItemInViewport(item: Item, leftGlobal: number, rightGlobal: number): boolean;
        getAllLinkedItemsIds(item: Item, items: Items, allLinked?: string[]): string[];
        getRow(rowId: string): Row;
        getRows(rowsId: string[]): Row[];
        getItem(itemId: string): Item;
        getItems(itemsId: string[]): Item[];
        prepareLinkedItems(item: Item, items: Items): void;
        prepareItems(items: Items): Items;
        fillEmptyRowValues(rows: Rows): Rows;
        itemsOnTheSameLevel(item1: Item, item2: Item): boolean;
        itemsOverlaps(item1: Item, item2: Item): boolean;
        itemOverlapsWithOthers(item: Item, items: Item[]): Item;
        fixOverlappedItems(rowItems: Item[]): void;
        sortItemsByPositionTop(rowItems: Item[]): Item[];
        recalculateRowHeight(row: Row, fixOverlapped?: boolean): number;
        recalculateRowsHeightsAndFixOverlappingItems(rowsId: string[]): number;
        recalculateRowsPercents(rowsId: string[], verticalAreaHeight: number): void;
        generateParents(rows: Rows | Items, parentName?: string): {};
        fastTree(rowParents: any, node: any, parents?: any[]): any;
        makeTreeMap(rows: Rows, items: Items): any;
        getRowsWithParentsExpanded(rows: Rows): any[];
        getVisibleRows(rowsWithParentsExpanded: string[]): string[];
        normalizeMouseWheelEvent(event: MouseWheelEvent): WheelResult;
        scrollToTime(toTime: number, centered?: boolean, time?: DataChartTime): number;
        setScrollLeft(dataIndex: number | undefined, time?: DataChartTime, multi?: any, recalculateTimesLastReason?: string): any;
        getScrollLeft(): ScrollTypeHorizontal;
        setScrollTop(dataIndex: number | undefined, offset?: number): void;
        getScrollTop(): ScrollTypeVertical;
        getSVGIconSrc(svg: any): string;
        destroy(): void;
    }
}
declare module "gstc" {
    import 'pepjs';
    import { vido, lithtml, ComponentInstance } from "../node_modules/@neuronet.io/vido/src/vido";
    import { Api } from "api/api";
    import { Dayjs, OpUnitType } from 'dayjs';
    import { Properties as CSSProps } from 'csstype';
    import DeepState from 'deep-state-observer';
    export type Vido = vido<DeepState, Api>;
    export interface RowDataPosition {
        top: number;
        topPercent: number;
        bottomPercent: number;
        viewTop: number;
    }
    export interface RowData {
        actualHeight: number;
        outerHeight: number;
        position: RowDataPosition;
        parents: string[];
        children: string[];
        items: string[];
    }
    export interface RowStyleObject {
        current?: CSSProps;
        children?: CSSProps;
    }
    export interface RowGridStyle {
        cell?: RowStyleObject;
        row?: RowStyleObject;
    }
    export interface RowItemsStyle {
        item?: RowStyleObject;
        row?: RowStyleObject;
    }
    export interface RowStyle extends RowStyleObject {
        grid?: RowGridStyle;
        items?: RowItemsStyle;
    }
    export interface Row {
        id: string;
        parentId?: string;
        expanded?: boolean;
        height?: number;
        $data?: RowData;
        gap?: RowGap;
        style?: RowStyle;
        classNames?: string[];
    }
    export interface Rows {
        [id: string]: Row;
    }
    export interface ItemTime {
        start: number;
        end: number;
    }
    export interface ItemDataTime {
        startDate: Dayjs;
        endDate: Dayjs;
    }
    export interface ItemDataPosition {
        left: number;
        actualLeft: number;
        right: number;
        actualRight: number;
        top: number;
        actualTop: number;
        viewTop: number;
    }
    export interface ItemData {
        time: ItemDataTime;
        actualHeight: number;
        outerHeight: number;
        position: ItemDataPosition;
        width: number;
        actualWidth: number;
        detached: boolean;
    }
    export type ItemLabelFunction = ({ item: Item, vido: Vido }: {
        item: any;
        vido: any;
    }) => lithtml.TemplateResult | string;
    export interface Item {
        id: string;
        rowId: string;
        time: ItemTime;
        label: string | ItemLabelFunction;
        height?: number;
        top?: number;
        gap?: ItemGap;
        minWidth?: number;
        style?: CSSProps;
        classNames?: string[];
        isHTML?: boolean;
        linkedWith?: string[];
        selected?: boolean;
        $data: ItemData;
    }
    export interface Items {
        [id: string]: Item;
    }
    export interface Cell {
        id: string;
        time: ChartTimeDate;
        top: number;
        row: Row;
    }
    export interface RowWithCells {
        row: Row;
        cells: Cell[];
        top: number;
        width: number;
    }
    export type VoidFunction = () => void;
    export type PluginInitialization = (vido: unknown) => void | VoidFunction;
    export type Plugin = <T>(options: T) => PluginInitialization;
    export type htmlResult = lithtml.TemplateResult | lithtml.SVGTemplateResult | undefined | null;
    export type RenderFunction = (templateProps: unknown) => htmlResult;
    export type Component = (vido: unknown, props: unknown) => RenderFunction;
    export interface Components {
        [name: string]: Component;
    }
    export type Wrapper = (input: htmlResult, props?: any) => htmlResult;
    export interface Wrappers {
        [name: string]: Wrapper;
    }
    export type SlotName = 'main' | 'scroll-bar' | 'list' | 'list-column' | 'list-column-header' | 'list-column-header-resizer' | 'list-column-header-resizer-dots' | 'list-column-row' | 'list-column-row-expander' | 'list-column-row-expander-toggle' | 'list-toggle' | 'chart' | 'chart-calendar' | 'chart-calendar-date' | 'chart-timeline' | 'chart-timeline-grid' | 'chart-timeline-grid-row' | 'chart-timeline-grid-row-cell' | 'chart-timeline-items' | 'chart-timeline-items-row' | 'chart-timeline-items-row-item';
    export type SlotPlacement = 'before' | 'after' | 'inside';
    export type Slot = {
        [placement in SlotPlacement]?: Component[];
    };
    export type Slots = {
        [name in SlotName]?: Slot;
    };
    export interface ColumnResizer {
        width?: number;
        inRealTime?: boolean;
        dots?: number;
    }
    export type ColumnDataFunctionString = ({ row: Row, vido: Vido }: {
        row: any;
        vido: any;
    }) => string;
    export type ColumnDataFunctionTemplate = ({ row: Row, vido: Vido }: {
        row: any;
        vido: any;
    }) => htmlResult;
    export interface ColumnDataHeader {
        html?: htmlResult;
        content?: string;
    }
    export interface ColumnData {
        id: string;
        data: string | ColumnDataFunctionString | ColumnDataFunctionTemplate;
        width: number;
        header: ColumnDataHeader;
        isHTML?: boolean;
        expander?: boolean;
        minWidth?: number;
    }
    export interface ColumnsData {
        [id: string]: ColumnData;
    }
    export interface Columns {
        percent?: number;
        resizer?: ColumnResizer;
        minWidth?: number;
        data?: ColumnsData;
    }
    export interface ExpanderIcon {
        width?: number;
        height?: number;
    }
    export interface ExpanderIcons {
        child?: string;
        open?: string;
        closed?: string;
    }
    export interface Expander {
        padding?: number;
        size?: number;
        icon?: ExpanderIcon;
        icons?: ExpanderIcons;
    }
    export interface ListToggleIcons {
        open?: string;
        close?: string;
    }
    export interface ListToggle {
        display?: boolean;
        icons?: ListToggleIcons;
    }
    export interface RowGap {
        top?: number;
        bottom?: number;
    }
    export interface ListRow {
        height?: number;
        gap?: RowGap;
    }
    export interface List {
        rows?: Rows;
        row?: ListRow;
        columns?: Columns;
        expander?: Expander;
        toggle?: ListToggle;
    }
    export interface ScrollPercent {
        top?: number;
        left?: number;
    }
    export interface ScrollType {
        size?: number;
        minInnerSize?: number;
        data?: Row | ChartTimeDate;
        posPx?: number;
        maxPosPx?: number;
        area?: number;
        areaWithoutLastPage?: number;
        smooth?: boolean;
        lastPageSize?: number;
        lastPageCount?: number;
        dataIndex?: number;
        sub?: number;
        scrollArea?: number;
        innerSize?: number;
        multiplier?: number;
        offset?: number;
    }
    export interface ScrollTypeHorizontal extends ScrollType {
        data?: ChartTimeDate;
    }
    export interface ScrollTypeVertical extends ScrollType {
        data?: Row;
    }
    export interface Scroll {
        bodyClassName?: string;
        horizontal?: ScrollTypeHorizontal;
        vertical?: ScrollTypeVertical;
    }
    export interface ChartTimeDate extends DataChartTimeLevelDate {
    }
    export type ChartTimeDates = ChartTimeDate[];
    export type ChartTimeOnLevelDatesArg = {
        dates: DataChartTimeLevel;
        time: DataChartTime;
        format: ChartCalendarFormat;
        level: ChartCalendarLevel;
        levelIndex: number;
    };
    export type ChartTimeOnLevelDates = (arg: ChartTimeOnLevelDatesArg) => DataChartTimeLevel;
    export type ChartTimeOnDateArg = {
        date: ChartTimeDate;
        time: DataChartTime;
        format: ChartCalendarFormat;
        level: ChartCalendarLevel;
        levelIndex: number;
    };
    export type ChartTimeOnDate = (arg: ChartTimeOnDateArg) => ChartTimeDate | null;
    export interface ChartTime {
        period?: Period;
        from?: number;
        readonly fromDate?: Dayjs;
        to?: number;
        readonly toDate?: Dayjs;
        zoom?: number;
        leftGlobal: number;
        readonly leftGlobalDate?: Dayjs;
        centerGlobal?: number;
        readonly centerGlobalDate?: Dayjs;
        rightGlobal?: number;
        readonly rightGlobalDate?: Dayjs;
        format?: ChartCalendarFormat;
        levels?: ChartTimeDates[];
        additionalSpaces?: ChartCalendarAdditionalSpaces;
        calculatedZoomMode?: boolean;
        onLevelDates?: ChartTimeOnLevelDates[];
        onCurrentViewLevelDates?: ChartTimeOnLevelDates[];
        onDate?: ChartTimeOnDate[];
        readonly allDates?: ChartTimeDates[];
        forceUpdate?: boolean;
        readonly additionalSpaceAdded?: boolean;
    }
    export interface DataChartTimeLevelDateCurrentView {
        leftPx: number;
        rightPx: number;
        width: number;
    }
    export interface DataChartTimeLevelDate {
        leftGlobal: number;
        leftGlobalDate: Dayjs;
        rightGlobal: number;
        rightGlobalDate: Dayjs;
        width: number;
        leftPx: number;
        rightPx: number;
        period: Period;
        formatted: string | htmlResult;
        current: boolean;
        next: boolean;
        previous: boolean;
        currentView?: DataChartTimeLevelDateCurrentView;
        leftPercent?: number;
        rightPercent?: number;
    }
    export type DataChartTimeLevel = DataChartTimeLevelDate[];
    export interface DataChartTime extends ChartTime {
        period: Period;
        leftGlobal: number;
        leftGlobalDate: Dayjs;
        centerGlobal: number;
        centerGlobalDate: Dayjs;
        rightGlobal: number;
        rightGlobalDate: Dayjs;
        timePerPixel: number;
        from: number;
        fromDate: Dayjs;
        to: number;
        toDate: Dayjs;
        totalViewDurationMs: number;
        totalViewDurationPx: number;
        leftInner: number;
        rightInner: number;
        leftPx: number;
        rightPx: number;
        width?: number;
        scrollWidth?: number;
        zoom: number;
        format: ChartCalendarFormat;
        level: number;
        levels: DataChartTimeLevel[];
        additionalSpaces?: ChartCalendarAdditionalSpaces;
        calculatedZoomMode?: boolean;
        onLevelDates?: ChartTimeOnLevelDates[];
        onCurrentViewLevelDates?: ChartTimeOnLevelDates[];
        allDates?: ChartTimeDates[];
        forceUpdate?: boolean;
        recalculateTimesLastReason?: string;
    }
    export interface ChartCalendarFormatArguments {
        timeStart: Dayjs;
        timeEnd: Dayjs;
        className: string;
        props: any;
        vido: any;
    }
    export type PeriodString = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
    export type Period = PeriodString | OpUnitType;
    export interface ChartCalendarFormat {
        zoomTo: number;
        period: Period;
        default?: boolean;
        className?: string;
        format: (args: ChartCalendarFormatArguments) => string | htmlResult;
    }
    export interface ChartCalendarAdditionalSpace {
        before: number;
        after: number;
        period: Period;
    }
    export interface ChartCalendarAdditionalSpaces {
        hour?: ChartCalendarAdditionalSpace;
        day?: ChartCalendarAdditionalSpace;
        week?: ChartCalendarAdditionalSpace;
        month?: ChartCalendarAdditionalSpace;
        year?: ChartCalendarAdditionalSpace;
    }
    export interface ChartCalendarLevel {
        formats?: ChartCalendarFormat[];
        main?: boolean;
        doNotUseCache?: boolean;
    }
    export interface ChartCalendar {
        levels?: ChartCalendarLevel[];
        expand?: boolean;
    }
    export interface ChartGridCell {
        onCreate: ((cell: any) => unknown)[];
    }
    export interface ChartGrid {
        cell?: ChartGridCell;
    }
    export interface ItemGap {
        top?: number;
        bottom?: number;
    }
    export interface DefaultItem {
        gap?: ItemGap;
        height?: number;
        top?: number;
        minWidth?: number;
    }
    export interface Chart {
        time?: ChartTime;
        calendar?: ChartCalendar;
        grid?: ChartGrid;
        items?: Items;
        item?: DefaultItem;
        spacing?: number;
    }
    export interface ClassNames {
        [componentName: string]: string;
    }
    export interface ActionFunctionResult {
        update?: (element: HTMLElement, data: unknown) => void;
        destroy?: (element: HTMLElement, data: unknown) => void;
    }
    export type Action = (element: HTMLElement, data: unknown) => ActionFunctionResult | ActionFunctionResult | void;
    export type Actions = {
        [name in SlotName]?: Action[];
    };
    export interface LocaleRelativeTime {
        future?: string;
        past?: string;
        s?: string;
        m?: string;
        mm?: string;
        h?: string;
        hh?: string;
        d?: string;
        dd?: string;
        M?: string;
        MM?: string;
        y?: string;
        yy?: string;
    }
    export interface LocaleFormats {
        LT?: string;
        LTS?: string;
        L?: string;
        LL?: string;
        LLL?: string;
        LLLL?: string;
        [key: string]: string;
    }
    export interface Locale {
        name?: string;
        weekdays?: string[];
        weekdaysShort?: string[];
        weekdaysMin?: string[];
        months?: string[];
        monthsShort?: string[];
        weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        relativeTime?: LocaleRelativeTime;
        formats?: LocaleFormats;
        ordinal?: (n: number) => string;
    }
    export interface Config {
        plugins?: Plugin[];
        plugin?: unknown;
        innerHeight?: number;
        headerHeight?: number;
        components?: Components;
        wrappers?: Wrappers;
        slots?: Slots;
        list?: List;
        scroll?: Scroll;
        chart?: Chart;
        classNames?: ClassNames;
        actions?: Actions;
        locale?: Locale;
        utcMode?: boolean;
        usageStatistics?: boolean;
        merge?: (target: object, source: object) => object;
    }
    export interface TreeMapData {
        parents: string[];
        children: Row[];
        items: Item[];
    }
    export interface TreeMap {
        id: string;
        $data: TreeMapData;
    }
    export interface DataList {
        width: number;
        visibleRows: string[];
        visibleRowsHeight: number;
        rowsWithParentsExpanded: string[];
        rowsHeight: number;
    }
    export interface Dimensions {
        width: number;
        height: number;
    }
    export interface DataChartDimensions extends Dimensions {
        innerWidth: number;
    }
    export interface DataChart {
        dimensions: DataChartDimensions;
        visibleItems: Item[];
        time: DataChartTime;
    }
    export interface DataElements {
        [key: string]: HTMLElement;
    }
    export interface Data {
        treeMap: TreeMap;
        list: DataList;
        dimensions: Dimensions;
        chart: DataChart;
        elements: DataElements;
    }
    export interface Reason {
        name: string;
        oldValue?: unknown;
        newValue?: unknown;
        from?: number;
        to?: number;
    }
    export interface GSTCOptions {
        state: DeepState;
        element: HTMLElement;
        debug?: boolean;
    }
    export interface GSTCResult {
        state: DeepState;
        api: Api;
        component: ComponentInstance;
        destroy: () => void;
        reload: () => void;
    }
    function GSTC(options: GSTCOptions): GSTCResult;
    namespace GSTC {
        var api: {
            name: string;
            stateFromConfig: typeof import("api/api").stateFromConfig;
            wasmStateFromConfig: typeof import("api/api").wasmStateFromConfig;
            merge: typeof import("@neuronet.io/vido/src/helpers").mergeDeep;
            lithtml: typeof lithtml;
            date(time: any): Dayjs;
            setPeriod(period: OpUnitType): number;
            dayjs: typeof import("dayjs");
        };
    }
    export default GSTC;
}
declare module "components/main" {
    import { Vido } from "gstc";
    export default function Main(vido: Vido, props?: {}): (templateProps: any) => any;
}
declare module "components/scroll-bar" {
    import { Vido } from "gstc";
    export interface Props {
        type: 'horizontal' | 'vertical';
    }
    export default function ScrollBar(vido: Vido, props: Props): () => import("lit-html-optimised").TemplateResult;
}
declare module "components/list/list" {
    import { Vido } from "gstc";
    export default function List(vido: Vido, props?: {}): (templateProps: any) => any;
}
declare module "components/list/column/column" {
    import { Vido, ColumnData } from "gstc";
    export interface Props {
        column: ColumnData;
    }
    export default function ListColumn(vido: Vido, props: Props): (templateProps: any) => any;
}
declare module "components/list/column/column-header" {
    import { Vido, ColumnData } from "gstc";
    export interface Props {
        column: ColumnData;
    }
    export default function ListColumnHeader(vido: Vido, props: Props): (templateProps: any) => any;
}
declare module "components/list/column/column-header-resizer" {
    import { Vido, ColumnData } from "gstc";
    export interface Props {
        column: ColumnData;
    }
    export default function ListColumnHeaderResizer(vido: Vido, props: Props): (templateProps: any) => any;
}
declare module "components/list/column/column-row" {
    import { ColumnData, Row, Vido } from "gstc";
    export interface Props {
        row: Row;
        column: ColumnData;
    }
    export default function ListColumnRow(vido: Vido, props: Props): (templateProps: any) => any;
}
declare module "components/list/column/column-row-expander" {
    import { Row, Vido } from "gstc";
    export interface Props {
        row: Row;
    }
    export default function ListColumnRowExpander(vido: Vido, props: Props): (templateProps: any) => any;
}
declare module "components/list/column/column-row-expander-toggle" {
    import { Row, Vido } from "gstc";
    export interface Props {
        row: Row;
    }
    export default function ListColumnRowExpanderToggle(vido: Vido, props: Props): (templateProps: any) => any;
}
declare module "components/list/list-toggle" {
    import { Vido } from "gstc";
    export default function ListToggle(vido: Vido, props?: {}): (templateProps: any) => any;
}
declare module "components/chart/chart" {
    import { Vido } from "gstc";
    export default function Chart(vido: Vido, props?: {}): (templateProps: any) => any;
}
declare module "components/chart/calendar/calendar" {
    import { Vido } from "gstc";
    export default function ChartCalendar(vido: Vido, props: any): (templateProps: any) => any;
}
declare module "components/chart/calendar/calendar-date" {
    import { ChartTimeDate, Period, Vido } from "gstc";
    export interface Props {
        level: number;
        date: ChartTimeDate;
        period: Period;
    }
    export default function ChartCalendarDay(vido: Vido, props: Props): (templateProps: any) => any;
}
declare module "components/chart/timeline/timeline" {
    import { Vido } from "gstc";
    export default function ChartTimeline(vido: Vido, props: any): (templateProps: any) => any;
}
declare module "components/chart/timeline/grid/grid" {
    import { Vido } from "gstc";
    export default function ChartTimelineGrid(vido: Vido, props: any): (templateProps: any) => any;
}
declare module "components/chart/timeline/grid/grid-row" {
    import { RowWithCells, Vido } from "gstc";
    export default function ChartTimelineGridRow(vido: Vido, props: RowWithCells): (templateProps: any) => any;
}
declare module "components/chart/timeline/grid/grid-row-cell" {
    import { Row, ChartTimeDate, Vido } from "gstc";
    interface Props {
        row: Row;
        time: ChartTimeDate;
    }
    function ChartTimelineGridRowCell(vido: Vido, props: Props): (templateProps: any) => any;
    export default ChartTimelineGridRowCell;
}
declare module "components/chart/timeline/items/items" {
    import { Vido } from "gstc";
    export default function ChartTimelineItems(vido: Vido, props?: {}): (templateProps: any) => any;
}
declare module "components/chart/timeline/items/items-row" {
    import { Row, Vido } from "gstc";
    export interface Props {
        row: Row;
    }
    export default function ChartTimelineItemsRow(vido: Vido, props: Props): (templateProps: any) => any;
}
declare module "components/chart/timeline/items/items-row-item" {
    import { Row, Item, Vido } from "gstc";
    export interface Props {
        row: Row;
        item: Item;
    }
    export default function ChartTimelineItemsRowItem(vido: Vido, props: Props): (templateProps: any) => any;
}
declare module "default-config" {
    import { Config, SlotName } from "gstc";
    export const actionNames: SlotName[];
    function defaultConfig(): Config;
    export default defaultConfig;
}
declare module "plugins/calendar-scroll.plugin" {
    export interface Point {
        x: number;
        y: number;
    }
    export interface Options {
        enabled: boolean;
        bodyClassName: string;
    }
    export function Plugin(options?: Options): (vidoInstance: any) => () => void;
}
declare module "plugins/highlight-weekends.plugin" {
    import { Vido } from "gstc";
    export interface Options {
        weekdays?: number[];
        className?: string;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/timeline-pointer.plugin" {
    import { Vido } from "gstc";
    export const CELL = "chart-timeline-grid-row-cell";
    export type CELL_TYPE = 'chart-timeline-grid-row-cell';
    export const ITEM = "chart-timeline-items-row-item";
    export type ITEM_TYPE = 'chart-timeline-items-row-item';
    export interface PointerEvents {
        down: PointerEvent | null;
        move: PointerEvent | null;
        up: PointerEvent | null;
    }
    export interface Point {
        x: number;
        y: number;
    }
    export type PointerState = 'up' | 'down' | 'move';
    export interface CaptureEvents {
        up?: boolean;
        down?: boolean;
        move?: boolean;
    }
    export interface Options {
        enabled?: boolean;
        captureEvents?: CaptureEvents;
    }
    export interface Offset {
        top: number;
        left: number;
    }
    export interface PluginData extends Options {
        isMoving: boolean;
        pointerState: PointerState;
        currentTarget: HTMLElement | null;
        realTarget: HTMLElement | null;
        targetType: ITEM_TYPE | CELL_TYPE | '';
        targetData: any | null;
        events: PointerEvents;
        offset: Offset;
        initialPosition: Point;
        currentPosition: Point;
    }
    export function Plugin(options: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/selection.plugin" {
    import { ITEM, ITEM_TYPE, CELL, CELL_TYPE, Point, PointerState } from "plugins/timeline-pointer.plugin";
    import { Item, Cell, Vido } from "gstc";
    export type ModKey = 'shift' | 'ctrl' | 'alt' | '';
    export interface Options {
        enabled?: boolean;
        cells?: boolean;
        items?: boolean;
        rows?: boolean;
        showOverlay?: boolean;
        rectangularSelection?: boolean;
        multipleSelection?: boolean;
        selectKey?: ModKey;
        multiKey?: ModKey;
        canSelect?: (type: any, state: any, all: any) => any[];
        canDeselect?: (type: any, state: any, all: any) => any[];
    }
    export interface SelectionItems {
        [key: string]: Item[];
    }
    export interface SelectState {
        selecting?: SelectionItems;
        selected?: SelectionItems;
    }
    export interface Area {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    export interface Selection {
        [ITEM]: Item[];
        [CELL]: Cell[];
    }
    export interface PointerEvents {
        down: PointerEvent | null;
        move: PointerEvent | null;
        up: PointerEvent | null;
    }
    export interface PluginData extends Options {
        enabled: boolean;
        isSelecting: boolean;
        showOverlay: boolean;
        pointerState: PointerState;
        initialPosition: Point;
        currentPosition: Point;
        selectionAreaLocal: Area;
        selectionAreaGlobal: Area;
        selected: Selection;
        selecting: Selection;
        automaticallySelected: Selection;
        events: PointerEvents;
        targetType: ITEM_TYPE | CELL_TYPE | '';
        targetData: any;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/item-movement.plugin" {
    import { Item, DataChartTime, Vido } from "gstc";
    import { Point } from "plugins/timeline-pointer.plugin";
    import { Dayjs } from 'dayjs';
    import DeepState from 'deep-state-observer';
    export interface SnapArg {
        item: Item;
        time: DataChartTime;
        vido: Vido;
        movement: Movement;
    }
    export interface SnapStartArg extends SnapArg {
        startTime: Dayjs;
    }
    export interface SnapEndArg extends SnapArg {
        endTime: Dayjs;
    }
    export interface SnapToTime {
        start?: (snapStartArgs: SnapStartArg) => Dayjs;
        end?: (snapEndArgs: SnapEndArg) => Dayjs;
    }
    export interface BeforeAfterInitialItems {
        initial: Item[];
        before: Item[];
        after: Item[];
        targetData: Item;
    }
    export interface OnArg {
        items: BeforeAfterInitialItems;
        vido: Vido;
        state: DeepState;
        time: DataChartTime;
    }
    export interface Events {
        onStart?: (onArg: OnArg) => Item[];
        onMove?: (onArg: OnArg) => Item[];
        onEnd?: (onArg: OnArg) => Item[];
    }
    export interface Options {
        enabled?: boolean;
        className?: string;
        bodyClass?: string;
        bodyClassMoving?: string;
        events?: Events;
        snapToTime?: SnapToTime;
        debug?: boolean;
    }
    export interface MovementResult {
        horizontal: number;
        vertical: number;
    }
    export interface Movement {
        px: MovementResult;
        time: number;
    }
    export interface LastMovement {
        x: number;
        y: number;
        time: number;
    }
    export interface PluginData extends Options {
        moving: Item[];
        targetData: Item | null;
        initialItems: Item[];
        movement: Movement;
        lastMovement: LastMovement;
        position: Point;
        pointerState: 'up' | 'down' | 'move';
        state: State;
        pointerMoved: boolean;
    }
    export interface MovingTimes {
        startTime: Dayjs;
        endTime: Dayjs;
    }
    export type State = '' | 'start' | 'end' | 'move' | '';
    export interface Cumulation {
        start: number;
        end: number;
    }
    export interface Cumulations {
        [key: string]: Cumulation;
    }
    export interface RelativeVerticalPosition {
        [key: string]: number;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/item-resizing.plugin" {
    import { Vido, htmlResult, Item, DataChartTime } from "gstc";
    import DeepState from 'deep-state-observer';
    import { Point } from "plugins/timeline-pointer.plugin";
    import { Dayjs } from 'dayjs';
    export interface Handle {
        width?: number;
        horizontalMargin?: number;
        verticalMargin?: number;
        outside?: boolean;
        onlyWhenSelected?: boolean;
    }
    export interface SnapArg {
        item: Item;
        time: DataChartTime;
        vido: Vido;
        movement: Movement;
    }
    export interface SnapStartArg extends SnapArg {
        startTime: Dayjs;
    }
    export interface SnapEndArg extends SnapArg {
        endTime: Dayjs;
    }
    export interface Movement {
        px: number;
        time: number;
    }
    export interface SnapToTime {
        start?: (snapStartArgs: SnapStartArg) => Dayjs;
        end?: (snapEndArgs: SnapEndArg) => Dayjs;
    }
    export interface BeforeAfterInitialItems {
        initial: Item[];
        before: Item[];
        after: Item[];
        targetData: Item | null;
    }
    export interface OnArg {
        items: BeforeAfterInitialItems;
        vido: Vido;
        state: DeepState;
        time: DataChartTime;
    }
    export interface Events {
        onStart?: (onArg: OnArg) => Item[];
        onResize?: (onArg: OnArg) => Item[];
        onEnd?: (onArg: OnArg) => Item[];
    }
    export interface Options {
        enabled?: boolean;
        debug?: boolean;
        handle?: Handle;
        content?: htmlResult;
        bodyClass?: string;
        bodyClassLeft?: string;
        bodyClassRight?: string;
        events?: Events;
        snapToTime?: SnapToTime;
    }
    export type State = 'start' | 'resize' | 'end' | '';
    export interface PluginData extends Options {
        leftIsMoving: boolean;
        rightIsMoving: boolean;
        initialItems: Item[];
        initialPosition: Point;
        currentPosition: Point;
        targetData: Item | null;
        state: State;
        movement: Movement;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/plugins" {
    import * as TimelinePointer from "plugins/timeline-pointer.plugin";
    import * as ItemMovement from "plugins/item-movement.plugin";
    import * as ItemResizing from "plugins/item-resizing.plugin";
    import * as Selection from "plugins/selection.plugin";
    import * as CalendarScroll from "plugins/calendar-scroll.plugin";
    import * as HighlightWeekends from "plugins/highlight-weekends.plugin";
    const _default: {
        TimelinePointer: typeof TimelinePointer;
        ItemMovement: typeof ItemMovement;
        ItemResizing: typeof ItemResizing;
        Selection: typeof Selection;
        CalendarScroll: typeof CalendarScroll;
        HighlightWeekends: typeof HighlightWeekends;
    };
    export default _default;
}
//# sourceMappingURL=global.d.ts.map