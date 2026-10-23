/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
/** @typedef {{ username: NonNullable<unknown>, status: NonNullable<unknown> }} Account_Menu_LabelInputs */
/** @typedef {{ username: NonNullable<unknown> }} Account_Signed_In_AsInputs */
/** @typedef {{}} Action_AddInputs */
/** @typedef {{}} Action_BackInputs */
/** @typedef {{}} Action_CancelInputs */
/** @typedef {{}} Action_DeleteInputs */
/** @typedef {{}} Action_DiscardInputs */
/** @typedef {{}} Action_ExportInputs */
/** @typedef {{}} Action_ImportInputs */
/** @typedef {{}} Action_NextInputs */
/** @typedef {{}} Action_ReloadInputs */
/** @typedef {{}} Action_RemoveInputs */
/** @typedef {{}} Action_ReplaceInputs */
/** @typedef {{}} Action_RestoreInputs */
/** @typedef {{}} Action_RetryInputs */
/** @typedef {{}} Action_SaveInputs */
/** @typedef {{}} Action_Sign_InInputs */
/** @typedef {{}} Action_Sign_OutInputs */
/** @typedef {{}} Action_UndoInputs */
/** @typedef {{}} Action_UpdateInputs */
/** @typedef {{}} Api_Error_Account_Not_EmptyInputs */
/** @typedef {{}} Api_Error_File_Too_LargeInputs */
/** @typedef {{}} Api_Error_ForbiddenInputs */
/** @typedef {{}} Api_Error_Invalid_LinkInputs */
/** @typedef {{}} Api_Error_Invalid_RequestInputs */
/** @typedef {{}} Api_Error_Not_FoundInputs */
/** @typedef {{}} Api_Error_UnauthorizedInputs */
/** @typedef {{}} Api_Error_Unknown_CategoryInputs */
/** @typedef {{}} Api_Error_Unknown_UserInputs */
/** @typedef {{}} Api_Error_Username_RequiredInputs */
/** @typedef {{}} Api_Error_Username_TakenInputs */
/** @typedef {{}} App_NameInputs */
/** @typedef {{}} Auth_PasswordInputs */
/** @typedef {{}} Auth_UsernameInputs */
/** @typedef {{}} Error_Try_AgainInputs */
/** @typedef {{}} Error_UnexpectedInputs */
/** @typedef {{}} Error_UnknownInputs */
/** @typedef {{}} Fixed_Cost_AddInputs */
/** @typedef {{}} Fixed_Cost_AmountInputs */
/** @typedef {{}} Fixed_Cost_Amount_EurInputs */
/** @typedef {{}} Fixed_Cost_Breakdown_TitleInputs */
/** @typedef {{}} Fixed_Cost_CategoriesInputs */
/** @typedef {{}} Fixed_Cost_CategoryInputs */
/** @typedef {{}} Fixed_Cost_Choose_CategoryInputs */
/** @typedef {{}} Fixed_Cost_Choose_Start_DateInputs */
/** @typedef {{ name: NonNullable<unknown> }} Fixed_Cost_CreatedInputs */
/** @typedef {{}} Fixed_Cost_Delete_DescriptionInputs */
/** @typedef {{}} Fixed_Cost_Delete_FailedInputs */
/** @typedef {{}} Fixed_Cost_Delete_TitleInputs */
/** @typedef {{}} Fixed_Cost_DeletedInputs */
/** @typedef {{}} Fixed_Cost_EditInputs */
/** @typedef {{}} Fixed_Cost_End_DateInputs */
/** @typedef {{}} Fixed_Cost_End_Date_HintInputs */
/** @typedef {{}} Fixed_Cost_End_Date_OptionalInputs */
/** @typedef {{}} Fixed_Cost_IntervalInputs */
/** @typedef {{}} Fixed_Cost_Interval_MonthlyInputs */
/** @typedef {{}} Fixed_Cost_Interval_QuarterlyInputs */
/** @typedef {{}} Fixed_Cost_Interval_YearlyInputs */
/** @typedef {{}} Fixed_Cost_List_EmptyInputs */
/** @typedef {{}} Fixed_Cost_Monthly_TotalInputs */
/** @typedef {{}} Fixed_Cost_NameInputs */
/** @typedef {{}} Fixed_Cost_Name_PlaceholderInputs */
/** @typedef {{}} Fixed_Cost_NewInputs */
/** @typedef {{}} Fixed_Cost_Not_FoundInputs */
/** @typedef {{}} Fixed_Cost_Per_MonthInputs */
/** @typedef {{}} Fixed_Cost_Save_FailedInputs */
/** @typedef {{}} Fixed_Cost_Start_DateInputs */
/** @typedef {{}} Fixed_Cost_Unknown_CategoryInputs */
/** @typedef {{}} Fixed_Cost_Update_FailedInputs */
/** @typedef {{}} Fixed_Cost_UpdatedInputs */
/** @typedef {{}} Fixed_Cost_Valid_FromInputs */
/** @typedef {{}} Fixed_Cost_Valid_From_HintInputs */
/** @typedef {{}} Fixed_Costs_TitleInputs */
/** @typedef {{}} Kind_ExpenseInputs */
/** @typedef {{}} Kind_IncomeInputs */
/** @typedef {{}} Link_Create_AccountInputs */
/** @typedef {{}} Link_For_UserInputs */
/** @typedef {{}} Link_InvalidInputs */
/** @typedef {{ count: NonNullable<unknown> }} Link_Min_Password_LengthInputs */
/** @typedef {{}} Link_Password_ChangedInputs */
/** @typedef {{}} Link_Password_Saved_Sign_InInputs */
/** @typedef {{}} Link_Passwords_DifferInputs */
/** @typedef {{}} Link_Repeat_PasswordInputs */
/** @typedef {{}} Link_Set_New_PasswordInputs */
/** @typedef {{}} Link_TitleInputs */
/** @typedef {{}} Link_Username_RulesInputs */
/** @typedef {{}} Link_WelcomeInputs */
/** @typedef {{}} Login_FailedInputs */
/** @typedef {{}} Login_Wrong_CredentialsInputs */
/** @typedef {{}} Month_ChooseInputs */
/** @typedef {{}} Month_NextInputs */
/** @typedef {{}} Month_Next_YearInputs */
/** @typedef {{}} Month_PreviousInputs */
/** @typedef {{}} Month_Previous_YearInputs */
/** @typedef {{}} Nav_LabelInputs */
/** @typedef {{}} Nav_OverviewInputs */
/** @typedef {{}} Nav_TransactionsInputs */
/** @typedef {{}} Offline_UnavailableInputs */
/** @typedef {{}} Overview_Categories_EmptyInputs */
/** @typedef {{}} Overview_Categories_HintInputs */
/** @typedef {{}} Overview_Categories_TitleInputs */
/** @typedef {{ count: NonNullable<unknown>, amount: NonNullable<unknown> }} Overview_ExceptionalInputs */
/** @typedef {{}} Overview_ExpensesInputs */
/** @typedef {{}} Overview_Fixed_CostsInputs */
/** @typedef {{ count: NonNullable<unknown>, amount: NonNullable<unknown> }} Overview_Gross_Outflow_ExceptionalInputs */
/** @typedef {{}} Overview_Gross_Outflow_HintInputs */
/** @typedef {{}} Overview_Gross_Outflow_So_FarInputs */
/** @typedef {{}} Overview_Gross_Outflow_SpendingInputs */
/** @typedef {{}} Overview_Gross_Outflow_TitleInputs */
/** @typedef {{}} Overview_IncomeInputs */
/** @typedef {{}} Overview_Net_SpendingInputs */
/** @typedef {{ percent: NonNullable<unknown>, day: NonNullable<unknown> }} Overview_Pace_Above_DayInputs */
/** @typedef {{ percent: NonNullable<unknown> }} Overview_Pace_Above_MonthInputs */
/** @typedef {{ percent: NonNullable<unknown>, day: NonNullable<unknown> }} Overview_Pace_Below_DayInputs */
/** @typedef {{ percent: NonNullable<unknown> }} Overview_Pace_Below_MonthInputs */
/** @typedef {{}} Overview_Pace_EvenInputs */
/** @typedef {{}} Overview_Pace_NoneInputs */
/** @typedef {{}} Overview_Total_OutflowInputs */
/** @typedef {{}} Overview_Trend_HintInputs */
/** @typedef {{}} Overview_Trend_TitleInputs */
/** @typedef {{ change: NonNullable<unknown> }} Overview_Vs_TypicalInputs */
/** @typedef {{ page: NonNullable<unknown> }} Page_TitleInputs */
/** @typedef {{ category: NonNullable<unknown>, change: NonNullable<unknown> }} Pattern_DriftInputs */
/** @typedef {{ name: NonNullable<unknown>, count: NonNullable<unknown>, average: NonNullable<unknown> }} Pattern_RecurringInputs */
/** @typedef {{ share: NonNullable<unknown>, category: NonNullable<unknown>, first: NonNullable<unknown>, last: NonNullable<unknown> }} Pattern_RhythmInputs */
/** @typedef {{ count: NonNullable<unknown>, limit: NonNullable<unknown>, total: NonNullable<unknown> }} Pattern_SmallInputs */
/** @typedef {{ count: NonNullable<unknown>, limit: NonNullable<unknown>, total: NonNullable<unknown>, name: NonNullable<unknown> }} Pattern_Small_TopInputs */
/** @typedef {{}} Patterns_HintInputs */
/** @typedef {{}} Patterns_TitleInputs */
/** @typedef {{}} PeriodInputs */
/** @typedef {{}} Period_AnyInputs */
/** @typedef {{}} Period_Choose_SearchInputs */
/** @typedef {{}} Period_CustomInputs */
/** @typedef {{}} Period_Older_Than_Half_YearInputs */
/** @typedef {{}} Period_Older_Than_MonthInputs */
/** @typedef {{}} Period_Older_Than_WeekInputs */
/** @typedef {{}} Period_Older_Than_YearInputs */
/** @typedef {{}} Pwa_Offline_ReadyInputs */
/** @typedef {{}} Pwa_Update_AvailableInputs */
/** @typedef {{}} Pwa_Wait_For_SyncInputs */
/** @typedef {{}} Sankey_Amount_PlaceholderInputs */
/** @typedef {{}} Sankey_DescriptionInputs */
/** @typedef {{}} Sankey_Income_Source_PlaceholderInputs */
/** @typedef {{}} Sankey_Income_SourcesInputs */
/** @typedef {{}} Sankey_Invalid_MonthInputs */
/** @typedef {{}} Sankey_Load_FailedInputs */
/** @typedef {{}} Sankey_MonthInputs */
/** @typedef {{}} Sankey_Month_PlaceholderInputs */
/** @typedef {{}} Sankey_OpenInputs */
/** @typedef {{}} Sankey_Savings_Target_PlaceholderInputs */
/** @typedef {{}} Sankey_Savings_TargetsInputs */
/** @typedef {{}} Sankey_TitleInputs */
/** @typedef {{}} Sankey_YearInputs */
/** @typedef {{}} Sankey_Year_PlaceholderInputs */
/** @typedef {{}} Search_All_MonthsInputs */
/** @typedef {{}} Search_ClearInputs */
/** @typedef {{}} Search_LabelInputs */
/** @typedef {{}} Search_Load_MoreInputs */
/** @typedef {{}} Search_No_ResultsInputs */
/** @typedef {{}} Search_OfflineInputs */
/** @typedef {{}} Search_PlaceholderInputs */
/** @typedef {{}} Settings_Export_DescriptionInputs */
/** @typedef {{}} Settings_Export_FailedInputs */
/** @typedef {{}} Settings_Import_DescriptionInputs */
/** @typedef {{}} Settings_Import_FailedInputs */
/** @typedef {{}} Settings_Import_Invalid_FileInputs */
/** @typedef {{ issue: NonNullable<unknown> }} Settings_Import_Invalid_File_DetailInputs */
/** @typedef {{}} Settings_Import_Replace_DescriptionInputs */
/** @typedef {{}} Settings_Import_Replace_TitleInputs */
/** @typedef {{ transactions: NonNullable<unknown>, fixedCosts: NonNullable<unknown> }} Settings_Import_SuccessInputs */
/** @typedef {{}} Settings_LanguageInputs */
/** @typedef {{}} Settings_Language_DescriptionInputs */
/** @typedef {{}} Settings_LocationInputs */
/** @typedef {{}} Settings_Location_DeniedInputs */
/** @typedef {{}} Settings_Location_DescriptionInputs */
/** @typedef {{}} Settings_TitleInputs */
/** @typedef {{}} Sign_Out_Anyway_TitleInputs */
/** @typedef {{}} Sign_Out_FailedInputs */
/** @typedef {{ count: NonNullable<unknown> }} Sign_Out_Unsynced_ChangesInputs */
/** @typedef {{}} Sync_Action_DeletedInputs */
/** @typedef {{}} Sync_Action_SavedInputs */
/** @typedef {{}} Sync_Later_HintInputs */
/** @typedef {{ count: NonNullable<unknown> }} Sync_Menu_FailedInputs */
/** @typedef {{}} Sync_Menu_OfflineInputs */
/** @typedef {{ count: NonNullable<unknown> }} Sync_Menu_Offline_PendingInputs */
/** @typedef {{ count: NonNullable<unknown> }} Sync_Menu_PendingInputs */
/** @typedef {{}} Sync_Menu_SyncedInputs */
/** @typedef {{}} Sync_Not_Synced_YetInputs */
/** @typedef {{}} Sync_NowInputs */
/** @typedef {{}} Sync_PendingInputs */
/** @typedef {{}} Sync_RejectedInputs */
/** @typedef {{ status: NonNullable<unknown> }} Sync_Rejected_StatusInputs */
/** @typedef {{}} Sync_Server_UnreachableInputs */
/** @typedef {{}} Sync_Status_FailedInputs */
/** @typedef {{}} Sync_Status_OfflineInputs */
/** @typedef {{}} Sync_Status_PendingInputs */
/** @typedef {{}} Sync_Status_SyncedInputs */
/** @typedef {{}} Sync_TitleInputs */
/** @typedef {{}} Transaction_AmountInputs */
/** @typedef {{ amount: NonNullable<unknown> }} Transaction_Amount_LastInputs */
/** @typedef {{}} Transaction_Amount_MissingInputs */
/** @typedef {{}} Transaction_CategoryInputs */
/** @typedef {{}} Transaction_Category_MissingInputs */
/** @typedef {{}} Transaction_Choose_DateInputs */
/** @typedef {{ raw: NonNullable<unknown> }} Transaction_Counterparty_AliasedInputs */
/** @typedef {{}} Transaction_Counterparty_ExpenseInputs */
/** @typedef {{}} Transaction_Counterparty_IncomeInputs */
/** @typedef {{}} Transaction_Counterparty_MissingInputs */
/** @typedef {{ name: NonNullable<unknown> }} Transaction_Counterparty_UseInputs */
/** @typedef {{}} Transaction_DateInputs */
/** @typedef {{}} Transaction_Date_TodayInputs */
/** @typedef {{}} Transaction_Date_YesterdayInputs */
/** @typedef {{}} Transaction_Delete_DescriptionInputs */
/** @typedef {{}} Transaction_Delete_TitleInputs */
/** @typedef {{}} Transaction_DescriptionInputs */
/** @typedef {{}} Transaction_EditInputs */
/** @typedef {{}} Transaction_ExceptionalInputs */
/** @typedef {{}} Transaction_Expense_DeletedInputs */
/** @typedef {{ name: NonNullable<unknown> }} Transaction_Expense_SavedInputs */
/** @typedef {{ count: NonNullable<unknown>, name: NonNullable<unknown> }} Transaction_Expenses_SavedInputs */
/** @typedef {{}} Transaction_FabInputs */
/** @typedef {{}} Transaction_FilterInputs */
/** @typedef {{ category: NonNullable<unknown> }} Transaction_Filter_ActiveInputs */
/** @typedef {{}} Transaction_Filter_AllInputs */
/** @typedef {{}} Transaction_Income_DeletedInputs */
/** @typedef {{ name: NonNullable<unknown> }} Transaction_Income_SavedInputs */
/** @typedef {{ count: NonNullable<unknown>, name: NonNullable<unknown> }} Transaction_Incomes_SavedInputs */
/** @typedef {{ period: NonNullable<unknown> }} Transaction_List_EmptyInputs */
/** @typedef {{}} Transaction_List_LoadingInputs */
/** @typedef {{}} Transaction_List_OfflineInputs */
/** @typedef {{}} Transaction_List_UpcomingInputs */
/** @typedef {{}} Transaction_MoreInputs */
/** @typedef {{}} Transaction_NewInputs */
/** @typedef {{}} Transaction_No_DescriptionInputs */
/** @typedef {{}} Transaction_Not_FoundInputs */
/** @typedef {{}} Transaction_SplitInputs */
/** @typedef {{}} Transaction_Split_DescriptionInputs */
/** @typedef {{ category: NonNullable<unknown>, amount: NonNullable<unknown> }} Transaction_Split_RemainderInputs */
/** @typedef {{ amount: NonNullable<unknown> }} Transaction_Split_Remainder_UncategorizedInputs */
/** @typedef {{}} Transaction_Split_RemoveInputs */
/** @typedef {{}} Transaction_Split_Too_MuchInputs */
/** @typedef {{}} Transaction_UpdatedInputs */
import * as __en from "./en.js"
import * as __de from "./de.js"
/**
* | output |
* | --- |
* | "{username}'s account, {status}" |
*
* @param {Account_Menu_LabelInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const account_menu_label = /** @type {((inputs: Account_Menu_LabelInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Menu_LabelInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.account_menu_label(inputs)
	return __en.account_menu_label(inputs)
});
/**
* | output |
* | --- |
* | "Signed in as {username}" |
*
* @param {Account_Signed_In_AsInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const account_signed_in_as = /** @type {((inputs: Account_Signed_In_AsInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Signed_In_AsInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.account_signed_in_as(inputs)
	return __en.account_signed_in_as(inputs)
});
/**
* | output |
* | --- |
* | "Add" |
*
* @param {Action_AddInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_add = /** @type {((inputs?: Action_AddInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_AddInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_add(inputs)
	return __en.action_add(inputs)
});
/**
* | output |
* | --- |
* | "Back" |
*
* @param {Action_BackInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_back = /** @type {((inputs?: Action_BackInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_BackInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_back(inputs)
	return __en.action_back(inputs)
});
/**
* | output |
* | --- |
* | "Cancel" |
*
* @param {Action_CancelInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_cancel = /** @type {((inputs?: Action_CancelInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_CancelInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_cancel(inputs)
	return __en.action_cancel(inputs)
});
/**
* | output |
* | --- |
* | "Delete" |
*
* @param {Action_DeleteInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_delete = /** @type {((inputs?: Action_DeleteInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_DeleteInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_delete(inputs)
	return __en.action_delete(inputs)
});
/**
* | output |
* | --- |
* | "Discard" |
*
* @param {Action_DiscardInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_discard = /** @type {((inputs?: Action_DiscardInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_DiscardInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_discard(inputs)
	return __en.action_discard(inputs)
});
/**
* | output |
* | --- |
* | "Export" |
*
* @param {Action_ExportInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_export = /** @type {((inputs?: Action_ExportInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_ExportInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_export(inputs)
	return __en.action_export(inputs)
});
/**
* | output |
* | --- |
* | "Import" |
*
* @param {Action_ImportInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_import = /** @type {((inputs?: Action_ImportInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_ImportInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_import(inputs)
	return __en.action_import(inputs)
});
/**
* | output |
* | --- |
* | "Next" |
*
* @param {Action_NextInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_next = /** @type {((inputs?: Action_NextInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_NextInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_next(inputs)
	return __en.action_next(inputs)
});
/**
* | output |
* | --- |
* | "Reload" |
*
* @param {Action_ReloadInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_reload = /** @type {((inputs?: Action_ReloadInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_ReloadInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_reload(inputs)
	return __en.action_reload(inputs)
});
/**
* | output |
* | --- |
* | "Remove" |
*
* @param {Action_RemoveInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_remove = /** @type {((inputs?: Action_RemoveInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_RemoveInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_remove(inputs)
	return __en.action_remove(inputs)
});
/**
* | output |
* | --- |
* | "Replace" |
*
* @param {Action_ReplaceInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_replace = /** @type {((inputs?: Action_ReplaceInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_ReplaceInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_replace(inputs)
	return __en.action_replace(inputs)
});
/**
* | output |
* | --- |
* | "Restore" |
*
* @param {Action_RestoreInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_restore = /** @type {((inputs?: Action_RestoreInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_RestoreInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_restore(inputs)
	return __en.action_restore(inputs)
});
/**
* | output |
* | --- |
* | "Try again" |
*
* @param {Action_RetryInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_retry = /** @type {((inputs?: Action_RetryInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_RetryInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_retry(inputs)
	return __en.action_retry(inputs)
});
/**
* | output |
* | --- |
* | "Save" |
*
* @param {Action_SaveInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_save = /** @type {((inputs?: Action_SaveInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_SaveInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_save(inputs)
	return __en.action_save(inputs)
});
/**
* | output |
* | --- |
* | "Sign in" |
*
* @param {Action_Sign_InInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_sign_in = /** @type {((inputs?: Action_Sign_InInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_Sign_InInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_sign_in(inputs)
	return __en.action_sign_in(inputs)
});
/**
* | output |
* | --- |
* | "Sign out" |
*
* @param {Action_Sign_OutInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_sign_out = /** @type {((inputs?: Action_Sign_OutInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_Sign_OutInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_sign_out(inputs)
	return __en.action_sign_out(inputs)
});
/**
* | output |
* | --- |
* | "Undo" |
*
* @param {Action_UndoInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_undo = /** @type {((inputs?: Action_UndoInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_UndoInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_undo(inputs)
	return __en.action_undo(inputs)
});
/**
* | output |
* | --- |
* | "Update" |
*
* @param {Action_UpdateInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const action_update = /** @type {((inputs?: Action_UpdateInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_UpdateInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.action_update(inputs)
	return __en.action_update(inputs)
});
/**
* | output |
* | --- |
* | "Your account already contains data." |
*
* @param {Api_Error_Account_Not_EmptyInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_account_not_empty = /** @type {((inputs?: Api_Error_Account_Not_EmptyInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_Account_Not_EmptyInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_account_not_empty(inputs)
	return __en.api_error_account_not_empty(inputs)
});
/**
* | output |
* | --- |
* | "The file is too large." |
*
* @param {Api_Error_File_Too_LargeInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_file_too_large = /** @type {((inputs?: Api_Error_File_Too_LargeInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_File_Too_LargeInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_file_too_large(inputs)
	return __en.api_error_file_too_large(inputs)
});
/**
* | output |
* | --- |
* | "You aren't allowed to do that." |
*
* @param {Api_Error_ForbiddenInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_forbidden = /** @type {((inputs?: Api_Error_ForbiddenInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_ForbiddenInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_forbidden(inputs)
	return __en.api_error_forbidden(inputs)
});
/**
* | output |
* | --- |
* | "This link is invalid, has expired or has already been used." |
*
* @param {Api_Error_Invalid_LinkInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_invalid_link = /** @type {((inputs?: Api_Error_Invalid_LinkInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_Invalid_LinkInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_invalid_link(inputs)
	return __en.api_error_invalid_link(inputs)
});
/**
* | output |
* | --- |
* | "The data is invalid." |
*
* @param {Api_Error_Invalid_RequestInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_invalid_request = /** @type {((inputs?: Api_Error_Invalid_RequestInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_Invalid_RequestInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_invalid_request(inputs)
	return __en.api_error_invalid_request(inputs)
});
/**
* | output |
* | --- |
* | "Not found." |
*
* @param {Api_Error_Not_FoundInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_not_found = /** @type {((inputs?: Api_Error_Not_FoundInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_Not_FoundInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_not_found(inputs)
	return __en.api_error_not_found(inputs)
});
/**
* | output |
* | --- |
* | "Please sign in again." |
*
* @param {Api_Error_UnauthorizedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_unauthorized = /** @type {((inputs?: Api_Error_UnauthorizedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_UnauthorizedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_unauthorized(inputs)
	return __en.api_error_unauthorized(inputs)
});
/**
* | output |
* | --- |
* | "The category no longer exists." |
*
* @param {Api_Error_Unknown_CategoryInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_unknown_category = /** @type {((inputs?: Api_Error_Unknown_CategoryInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_Unknown_CategoryInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_unknown_category(inputs)
	return __en.api_error_unknown_category(inputs)
});
/**
* | output |
* | --- |
* | "This user doesn't exist." |
*
* @param {Api_Error_Unknown_UserInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_unknown_user = /** @type {((inputs?: Api_Error_Unknown_UserInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_Unknown_UserInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_unknown_user(inputs)
	return __en.api_error_unknown_user(inputs)
});
/**
* | output |
* | --- |
* | "Please enter a username." |
*
* @param {Api_Error_Username_RequiredInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_username_required = /** @type {((inputs?: Api_Error_Username_RequiredInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_Username_RequiredInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_username_required(inputs)
	return __en.api_error_username_required(inputs)
});
/**
* | output |
* | --- |
* | "This username is already taken." |
*
* @param {Api_Error_Username_TakenInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_username_taken = /** @type {((inputs?: Api_Error_Username_TakenInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_Username_TakenInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_username_taken(inputs)
	return __en.api_error_username_taken(inputs)
});
/**
* | output |
* | --- |
* | "Expense Tracker" |
*
* @param {App_NameInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const app_name = /** @type {((inputs?: App_NameInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_NameInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.app_name(inputs)
	return __en.app_name(inputs)
});
/**
* | output |
* | --- |
* | "Password" |
*
* @param {Auth_PasswordInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const auth_password = /** @type {((inputs?: Auth_PasswordInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_PasswordInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.auth_password(inputs)
	return __en.auth_password(inputs)
});
/**
* | output |
* | --- |
* | "Username" |
*
* @param {Auth_UsernameInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const auth_username = /** @type {((inputs?: Auth_UsernameInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_UsernameInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.auth_username(inputs)
	return __en.auth_username(inputs)
});
/**
* | output |
* | --- |
* | "That didn't work. Please try again." |
*
* @param {Error_Try_AgainInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const error_try_again = /** @type {((inputs?: Error_Try_AgainInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Try_AgainInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.error_try_again(inputs)
	return __en.error_try_again(inputs)
});
/**
* | output |
* | --- |
* | "An unknown error occurred. Please try again." |
*
* @param {Error_UnexpectedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const error_unexpected = /** @type {((inputs?: Error_UnexpectedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_UnexpectedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.error_unexpected(inputs)
	return __en.error_unexpected(inputs)
});
/**
* | output |
* | --- |
* | "Unknown error." |
*
* @param {Error_UnknownInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const error_unknown = /** @type {((inputs?: Error_UnknownInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_UnknownInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.error_unknown(inputs)
	return __en.error_unknown(inputs)
});
/**
* | output |
* | --- |
* | "Add fixed cost" |
*
* @param {Fixed_Cost_AddInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_add = /** @type {((inputs?: Fixed_Cost_AddInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_AddInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_add(inputs)
	return __en.fixed_cost_add(inputs)
});
/**
* | output |
* | --- |
* | "Amount" |
*
* @param {Fixed_Cost_AmountInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_amount = /** @type {((inputs?: Fixed_Cost_AmountInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_AmountInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_amount(inputs)
	return __en.fixed_cost_amount(inputs)
});
/**
* | output |
* | --- |
* | "Amount (EUR)" |
*
* @param {Fixed_Cost_Amount_EurInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_amount_eur = /** @type {((inputs?: Fixed_Cost_Amount_EurInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Amount_EurInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_amount_eur(inputs)
	return __en.fixed_cost_amount_eur(inputs)
});
/**
* | output |
* | --- |
* | "Fixed costs by category" |
*
* @param {Fixed_Cost_Breakdown_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_breakdown_title = /** @type {((inputs?: Fixed_Cost_Breakdown_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Breakdown_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_breakdown_title(inputs)
	return __en.fixed_cost_breakdown_title(inputs)
});
/**
* | output |
* | --- |
* | "Categories" |
*
* @param {Fixed_Cost_CategoriesInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_categories = /** @type {((inputs?: Fixed_Cost_CategoriesInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_CategoriesInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_categories(inputs)
	return __en.fixed_cost_categories(inputs)
});
/**
* | output |
* | --- |
* | "Category" |
*
* @param {Fixed_Cost_CategoryInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_category = /** @type {((inputs?: Fixed_Cost_CategoryInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_CategoryInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_category(inputs)
	return __en.fixed_cost_category(inputs)
});
/**
* | output |
* | --- |
* | "Choose a category" |
*
* @param {Fixed_Cost_Choose_CategoryInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_choose_category = /** @type {((inputs?: Fixed_Cost_Choose_CategoryInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Choose_CategoryInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_choose_category(inputs)
	return __en.fixed_cost_choose_category(inputs)
});
/**
* | output |
* | --- |
* | "Choose a start date" |
*
* @param {Fixed_Cost_Choose_Start_DateInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_choose_start_date = /** @type {((inputs?: Fixed_Cost_Choose_Start_DateInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Choose_Start_DateInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_choose_start_date(inputs)
	return __en.fixed_cost_choose_start_date(inputs)
});
/**
* | output |
* | --- |
* | "Fixed cost “{name}” added" |
*
* @param {Fixed_Cost_CreatedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_created = /** @type {((inputs: Fixed_Cost_CreatedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_CreatedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_created(inputs)
	return __en.fixed_cost_created(inputs)
});
/**
* | output |
* | --- |
* | "This can't be undone." |
*
* @param {Fixed_Cost_Delete_DescriptionInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_delete_description = /** @type {((inputs?: Fixed_Cost_Delete_DescriptionInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Delete_DescriptionInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_delete_description(inputs)
	return __en.fixed_cost_delete_description(inputs)
});
/**
* | output |
* | --- |
* | "The fixed cost couldn't be deleted. Please try again." |
*
* @param {Fixed_Cost_Delete_FailedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_delete_failed = /** @type {((inputs?: Fixed_Cost_Delete_FailedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Delete_FailedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_delete_failed(inputs)
	return __en.fixed_cost_delete_failed(inputs)
});
/**
* | output |
* | --- |
* | "Delete fixed cost?" |
*
* @param {Fixed_Cost_Delete_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_delete_title = /** @type {((inputs?: Fixed_Cost_Delete_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Delete_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_delete_title(inputs)
	return __en.fixed_cost_delete_title(inputs)
});
/**
* | output |
* | --- |
* | "Fixed cost deleted" |
*
* @param {Fixed_Cost_DeletedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_deleted = /** @type {((inputs?: Fixed_Cost_DeletedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_DeletedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_deleted(inputs)
	return __en.fixed_cost_deleted(inputs)
});
/**
* | output |
* | --- |
* | "Edit fixed cost" |
*
* @param {Fixed_Cost_EditInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_edit = /** @type {((inputs?: Fixed_Cost_EditInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_EditInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_edit(inputs)
	return __en.fixed_cost_edit(inputs)
});
/**
* | output |
* | --- |
* | "End date" |
*
* @param {Fixed_Cost_End_DateInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_end_date = /** @type {((inputs?: Fixed_Cost_End_DateInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_End_DateInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_end_date(inputs)
	return __en.fixed_cost_end_date(inputs)
});
/**
* | output |
* | --- |
* | "Leave empty for no end date" |
*
* @param {Fixed_Cost_End_Date_HintInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_end_date_hint = /** @type {((inputs?: Fixed_Cost_End_Date_HintInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_End_Date_HintInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_end_date_hint(inputs)
	return __en.fixed_cost_end_date_hint(inputs)
});
/**
* | output |
* | --- |
* | "End date (optional)" |
*
* @param {Fixed_Cost_End_Date_OptionalInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_end_date_optional = /** @type {((inputs?: Fixed_Cost_End_Date_OptionalInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_End_Date_OptionalInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_end_date_optional(inputs)
	return __en.fixed_cost_end_date_optional(inputs)
});
/**
* | output |
* | --- |
* | "Interval" |
*
* @param {Fixed_Cost_IntervalInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_interval = /** @type {((inputs?: Fixed_Cost_IntervalInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_IntervalInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_interval(inputs)
	return __en.fixed_cost_interval(inputs)
});
/**
* | output |
* | --- |
* | "Monthly" |
*
* @param {Fixed_Cost_Interval_MonthlyInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_interval_monthly = /** @type {((inputs?: Fixed_Cost_Interval_MonthlyInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Interval_MonthlyInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_interval_monthly(inputs)
	return __en.fixed_cost_interval_monthly(inputs)
});
/**
* | output |
* | --- |
* | "Quarterly" |
*
* @param {Fixed_Cost_Interval_QuarterlyInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_interval_quarterly = /** @type {((inputs?: Fixed_Cost_Interval_QuarterlyInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Interval_QuarterlyInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_interval_quarterly(inputs)
	return __en.fixed_cost_interval_quarterly(inputs)
});
/**
* | output |
* | --- |
* | "Yearly" |
*
* @param {Fixed_Cost_Interval_YearlyInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_interval_yearly = /** @type {((inputs?: Fixed_Cost_Interval_YearlyInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Interval_YearlyInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_interval_yearly(inputs)
	return __en.fixed_cost_interval_yearly(inputs)
});
/**
* | output |
* | --- |
* | "No fixed costs yet." |
*
* @param {Fixed_Cost_List_EmptyInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_list_empty = /** @type {((inputs?: Fixed_Cost_List_EmptyInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_List_EmptyInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_list_empty(inputs)
	return __en.fixed_cost_list_empty(inputs)
});
/**
* | output |
* | --- |
* | "Monthly total" |
*
* @param {Fixed_Cost_Monthly_TotalInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_monthly_total = /** @type {((inputs?: Fixed_Cost_Monthly_TotalInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Monthly_TotalInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_monthly_total(inputs)
	return __en.fixed_cost_monthly_total(inputs)
});
/**
* | output |
* | --- |
* | "Name" |
*
* @param {Fixed_Cost_NameInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_name = /** @type {((inputs?: Fixed_Cost_NameInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_NameInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_name(inputs)
	return __en.fixed_cost_name(inputs)
});
/**
* | output |
* | --- |
* | "e.g. Spotify" |
*
* @param {Fixed_Cost_Name_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_name_placeholder = /** @type {((inputs?: Fixed_Cost_Name_PlaceholderInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Name_PlaceholderInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_name_placeholder(inputs)
	return __en.fixed_cost_name_placeholder(inputs)
});
/**
* | output |
* | --- |
* | "New fixed cost" |
*
* @param {Fixed_Cost_NewInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_new = /** @type {((inputs?: Fixed_Cost_NewInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_NewInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_new(inputs)
	return __en.fixed_cost_new(inputs)
});
/**
* | output |
* | --- |
* | "Fixed cost not found." |
*
* @param {Fixed_Cost_Not_FoundInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_not_found = /** @type {((inputs?: Fixed_Cost_Not_FoundInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Not_FoundInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_not_found(inputs)
	return __en.fixed_cost_not_found(inputs)
});
/**
* | output |
* | --- |
* | "/ month" |
*
* @param {Fixed_Cost_Per_MonthInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_per_month = /** @type {((inputs?: Fixed_Cost_Per_MonthInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Per_MonthInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_per_month(inputs)
	return __en.fixed_cost_per_month(inputs)
});
/**
* | output |
* | --- |
* | "The fixed cost couldn't be saved. Please try again." |
*
* @param {Fixed_Cost_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_save_failed = /** @type {((inputs?: Fixed_Cost_Save_FailedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Save_FailedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_save_failed(inputs)
	return __en.fixed_cost_save_failed(inputs)
});
/**
* | output |
* | --- |
* | "Start date" |
*
* @param {Fixed_Cost_Start_DateInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_start_date = /** @type {((inputs?: Fixed_Cost_Start_DateInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Start_DateInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_start_date(inputs)
	return __en.fixed_cost_start_date(inputs)
});
/**
* | output |
* | --- |
* | "Unknown" |
*
* @param {Fixed_Cost_Unknown_CategoryInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_unknown_category = /** @type {((inputs?: Fixed_Cost_Unknown_CategoryInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Unknown_CategoryInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_unknown_category(inputs)
	return __en.fixed_cost_unknown_category(inputs)
});
/**
* | output |
* | --- |
* | "The fixed cost couldn't be updated. Please try again." |
*
* @param {Fixed_Cost_Update_FailedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_update_failed = /** @type {((inputs?: Fixed_Cost_Update_FailedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Update_FailedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_update_failed(inputs)
	return __en.fixed_cost_update_failed(inputs)
});
/**
* | output |
* | --- |
* | "Fixed cost updated" |
*
* @param {Fixed_Cost_UpdatedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_updated = /** @type {((inputs?: Fixed_Cost_UpdatedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_UpdatedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_updated(inputs)
	return __en.fixed_cost_updated(inputs)
});
/**
* | output |
* | --- |
* | "Valid from" |
*
* @param {Fixed_Cost_Valid_FromInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_valid_from = /** @type {((inputs?: Fixed_Cost_Valid_FromInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Valid_FromInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_valid_from(inputs)
	return __en.fixed_cost_valid_from(inputs)
});
/**
* | output |
* | --- |
* | "Earlier months keep the previous amount." |
*
* @param {Fixed_Cost_Valid_From_HintInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_valid_from_hint = /** @type {((inputs?: Fixed_Cost_Valid_From_HintInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Valid_From_HintInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_valid_from_hint(inputs)
	return __en.fixed_cost_valid_from_hint(inputs)
});
/**
* | output |
* | --- |
* | "Fixed costs" |
*
* @param {Fixed_Costs_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_costs_title = /** @type {((inputs?: Fixed_Costs_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Costs_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_costs_title(inputs)
	return __en.fixed_costs_title(inputs)
});
/**
* | output |
* | --- |
* | "Expense" |
*
* @param {Kind_ExpenseInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const kind_expense = /** @type {((inputs?: Kind_ExpenseInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kind_ExpenseInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.kind_expense(inputs)
	return __en.kind_expense(inputs)
});
/**
* | output |
* | --- |
* | "Income" |
*
* @param {Kind_IncomeInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const kind_income = /** @type {((inputs?: Kind_IncomeInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kind_IncomeInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.kind_income(inputs)
	return __en.kind_income(inputs)
});
/**
* | output |
* | --- |
* | "Create account" |
*
* @param {Link_Create_AccountInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_create_account = /** @type {((inputs?: Link_Create_AccountInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_Create_AccountInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_create_account(inputs)
	return __en.link_create_account(inputs)
});
/**
* | output |
* | --- |
* | "For" |
*
* @param {Link_For_UserInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_for_user = /** @type {((inputs?: Link_For_UserInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_For_UserInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_for_user(inputs)
	return __en.link_for_user(inputs)
});
/**
* | output |
* | --- |
* | "This link is invalid, has expired or has already been used. Please ask for a new one." |
*
* @param {Link_InvalidInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_invalid = /** @type {((inputs?: Link_InvalidInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_InvalidInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_invalid(inputs)
	return __en.link_invalid(inputs)
});
/**
* | output |
* | --- |
* | "At least {count} characters" |
*
* @param {Link_Min_Password_LengthInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_min_password_length = /** @type {((inputs: Link_Min_Password_LengthInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_Min_Password_LengthInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_min_password_length(inputs)
	return __en.link_min_password_length(inputs)
});
/**
* | output |
* | --- |
* | "Password changed" |
*
* @param {Link_Password_ChangedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_password_changed = /** @type {((inputs?: Link_Password_ChangedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_Password_ChangedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_password_changed(inputs)
	return __en.link_password_changed(inputs)
});
/**
* | output |
* | --- |
* | "Password saved. Please sign in." |
*
* @param {Link_Password_Saved_Sign_InInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_password_saved_sign_in = /** @type {((inputs?: Link_Password_Saved_Sign_InInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_Password_Saved_Sign_InInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_password_saved_sign_in(inputs)
	return __en.link_password_saved_sign_in(inputs)
});
/**
* | output |
* | --- |
* | "The passwords don't match." |
*
* @param {Link_Passwords_DifferInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_passwords_differ = /** @type {((inputs?: Link_Passwords_DifferInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_Passwords_DifferInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_passwords_differ(inputs)
	return __en.link_passwords_differ(inputs)
});
/**
* | output |
* | --- |
* | "Repeat password" |
*
* @param {Link_Repeat_PasswordInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_repeat_password = /** @type {((inputs?: Link_Repeat_PasswordInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_Repeat_PasswordInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_repeat_password(inputs)
	return __en.link_repeat_password(inputs)
});
/**
* | output |
* | --- |
* | "Set a new password" |
*
* @param {Link_Set_New_PasswordInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_set_new_password = /** @type {((inputs?: Link_Set_New_PasswordInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_Set_New_PasswordInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_set_new_password(inputs)
	return __en.link_set_new_password(inputs)
});
/**
* | output |
* | --- |
* | "Link" |
*
* @param {Link_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_title = /** @type {((inputs?: Link_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_title(inputs)
	return __en.link_title(inputs)
});
/**
* | output |
* | --- |
* | "Username: 3–30 characters (letters, digits, _ and .)." |
*
* @param {Link_Username_RulesInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_username_rules = /** @type {((inputs?: Link_Username_RulesInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_Username_RulesInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_username_rules(inputs)
	return __en.link_username_rules(inputs)
});
/**
* | output |
* | --- |
* | "Welcome!" |
*
* @param {Link_WelcomeInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const link_welcome = /** @type {((inputs?: Link_WelcomeInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Link_WelcomeInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.link_welcome(inputs)
	return __en.link_welcome(inputs)
});
/**
* | output |
* | --- |
* | "Sign-in failed. Please try again." |
*
* @param {Login_FailedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const login_failed = /** @type {((inputs?: Login_FailedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_FailedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.login_failed(inputs)
	return __en.login_failed(inputs)
});
/**
* | output |
* | --- |
* | "Wrong username or password." |
*
* @param {Login_Wrong_CredentialsInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const login_wrong_credentials = /** @type {((inputs?: Login_Wrong_CredentialsInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_Wrong_CredentialsInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.login_wrong_credentials(inputs)
	return __en.login_wrong_credentials(inputs)
});
/**
* | output |
* | --- |
* | "Choose month" |
*
* @param {Month_ChooseInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const month_choose = /** @type {((inputs?: Month_ChooseInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Month_ChooseInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.month_choose(inputs)
	return __en.month_choose(inputs)
});
/**
* | output |
* | --- |
* | "Next month" |
*
* @param {Month_NextInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const month_next = /** @type {((inputs?: Month_NextInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Month_NextInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.month_next(inputs)
	return __en.month_next(inputs)
});
/**
* | output |
* | --- |
* | "Next year" |
*
* @param {Month_Next_YearInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const month_next_year = /** @type {((inputs?: Month_Next_YearInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Month_Next_YearInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.month_next_year(inputs)
	return __en.month_next_year(inputs)
});
/**
* | output |
* | --- |
* | "Previous month" |
*
* @param {Month_PreviousInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const month_previous = /** @type {((inputs?: Month_PreviousInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Month_PreviousInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.month_previous(inputs)
	return __en.month_previous(inputs)
});
/**
* | output |
* | --- |
* | "Previous year" |
*
* @param {Month_Previous_YearInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const month_previous_year = /** @type {((inputs?: Month_Previous_YearInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Month_Previous_YearInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.month_previous_year(inputs)
	return __en.month_previous_year(inputs)
});
/**
* | output |
* | --- |
* | "Main navigation" |
*
* @param {Nav_LabelInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const nav_label = /** @type {((inputs?: Nav_LabelInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_LabelInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.nav_label(inputs)
	return __en.nav_label(inputs)
});
/**
* | output |
* | --- |
* | "Overview" |
*
* @param {Nav_OverviewInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const nav_overview = /** @type {((inputs?: Nav_OverviewInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_OverviewInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.nav_overview(inputs)
	return __en.nav_overview(inputs)
});
/**
* | output |
* | --- |
* | "Transactions" |
*
* @param {Nav_TransactionsInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const nav_transactions = /** @type {((inputs?: Nav_TransactionsInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_TransactionsInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.nav_transactions(inputs)
	return __en.nav_transactions(inputs)
});
/**
* | output |
* | --- |
* | "Not available offline" |
*
* @param {Offline_UnavailableInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const offline_unavailable = /** @type {((inputs?: Offline_UnavailableInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Offline_UnavailableInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.offline_unavailable(inputs)
	return __en.offline_unavailable(inputs)
});
/**
* | output |
* | --- |
* | "No spending this month" |
*
* @param {Overview_Categories_EmptyInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_categories_empty = /** @type {((inputs?: Overview_Categories_EmptyInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Categories_EmptyInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_categories_empty(inputs)
	return __en.overview_categories_empty(inputs)
});
/**
* | output |
* | --- |
* | "Line: typical month" |
*
* @param {Overview_Categories_HintInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_categories_hint = /** @type {((inputs?: Overview_Categories_HintInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Categories_HintInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_categories_hint(inputs)
	return __en.overview_categories_hint(inputs)
});
/**
* | output |
* | --- |
* | "Categories" |
*
* @param {Overview_Categories_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_categories_title = /** @type {((inputs?: Overview_Categories_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Categories_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_categories_title(inputs)
	return __en.overview_categories_title(inputs)
});
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Incl. {count} exceptional transaction: {amount}" |
* | "other" | "Incl. {count} exceptional transactions: {amount}" |
*
* @param {Overview_ExceptionalInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_exceptional = /** @type {((inputs: Overview_ExceptionalInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_ExceptionalInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_exceptional(inputs)
	return __en.overview_exceptional(inputs)
});
/**
* | output |
* | --- |
* | "Expenses" |
*
* @param {Overview_ExpensesInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_expenses = /** @type {((inputs?: Overview_ExpensesInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_ExpensesInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_expenses(inputs)
	return __en.overview_expenses(inputs)
});
/**
* | output |
* | --- |
* | "+ Fixed costs" |
*
* @param {Overview_Fixed_CostsInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_fixed_costs = /** @type {((inputs?: Overview_Fixed_CostsInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Fixed_CostsInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_fixed_costs(inputs)
	return __en.overview_fixed_costs(inputs)
});
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Excl. {count} exceptional transaction ({amount})" |
* | "other" | "Excl. {count} exceptional transactions ({amount})" |
*
* @param {Overview_Gross_Outflow_ExceptionalInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_gross_outflow_exceptional = /** @type {((inputs: Overview_Gross_Outflow_ExceptionalInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Gross_Outflow_ExceptionalInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_gross_outflow_exceptional(inputs)
	return __en.overview_gross_outflow_exceptional(inputs)
});
/**
* | output |
* | --- |
* | "Fixed costs and spending, without income" |
*
* @param {Overview_Gross_Outflow_HintInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_gross_outflow_hint = /** @type {((inputs?: Overview_Gross_Outflow_HintInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Gross_Outflow_HintInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_gross_outflow_hint(inputs)
	return __en.overview_gross_outflow_hint(inputs)
});
/**
* | output |
* | --- |
* | "Whole month's fixed costs, spending so far, without income" |
*
* @param {Overview_Gross_Outflow_So_FarInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_gross_outflow_so_far = /** @type {((inputs?: Overview_Gross_Outflow_So_FarInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Gross_Outflow_So_FarInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_gross_outflow_so_far(inputs)
	return __en.overview_gross_outflow_so_far(inputs)
});
/**
* | output |
* | --- |
* | "Spending" |
*
* @param {Overview_Gross_Outflow_SpendingInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_gross_outflow_spending = /** @type {((inputs?: Overview_Gross_Outflow_SpendingInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Gross_Outflow_SpendingInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_gross_outflow_spending(inputs)
	return __en.overview_gross_outflow_spending(inputs)
});
/**
* | output |
* | --- |
* | "Where the money goes" |
*
* @param {Overview_Gross_Outflow_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_gross_outflow_title = /** @type {((inputs?: Overview_Gross_Outflow_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Gross_Outflow_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_gross_outflow_title(inputs)
	return __en.overview_gross_outflow_title(inputs)
});
/**
* | output |
* | --- |
* | "Income" |
*
* @param {Overview_IncomeInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_income = /** @type {((inputs?: Overview_IncomeInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_IncomeInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_income(inputs)
	return __en.overview_income(inputs)
});
/**
* | output |
* | --- |
* | "Net spending" |
*
* @param {Overview_Net_SpendingInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_net_spending = /** @type {((inputs?: Overview_Net_SpendingInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Net_SpendingInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_net_spending(inputs)
	return __en.overview_net_spending(inputs)
});
/**
* | output |
* | --- |
* | "{percent} above a typical month by day {day}" |
*
* @param {Overview_Pace_Above_DayInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_pace_above_day = /** @type {((inputs: Overview_Pace_Above_DayInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Pace_Above_DayInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_pace_above_day(inputs)
	return __en.overview_pace_above_day(inputs)
});
/**
* | output |
* | --- |
* | "{percent} above a typical month" |
*
* @param {Overview_Pace_Above_MonthInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_pace_above_month = /** @type {((inputs: Overview_Pace_Above_MonthInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Pace_Above_MonthInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_pace_above_month(inputs)
	return __en.overview_pace_above_month(inputs)
});
/**
* | output |
* | --- |
* | "{percent} below a typical month by day {day}" |
*
* @param {Overview_Pace_Below_DayInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_pace_below_day = /** @type {((inputs: Overview_Pace_Below_DayInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Pace_Below_DayInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_pace_below_day(inputs)
	return __en.overview_pace_below_day(inputs)
});
/**
* | output |
* | --- |
* | "{percent} below a typical month" |
*
* @param {Overview_Pace_Below_MonthInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_pace_below_month = /** @type {((inputs: Overview_Pace_Below_MonthInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Pace_Below_MonthInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_pace_below_month(inputs)
	return __en.overview_pace_below_month(inputs)
});
/**
* | output |
* | --- |
* | "Like a typical month" |
*
* @param {Overview_Pace_EvenInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_pace_even = /** @type {((inputs?: Overview_Pace_EvenInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Pace_EvenInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_pace_even(inputs)
	return __en.overview_pace_even(inputs)
});
/**
* | output |
* | --- |
* | "Not enough history for a typical month yet" |
*
* @param {Overview_Pace_NoneInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_pace_none = /** @type {((inputs?: Overview_Pace_NoneInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Pace_NoneInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_pace_none(inputs)
	return __en.overview_pace_none(inputs)
});
/**
* | output |
* | --- |
* | "= Total outflow" |
*
* @param {Overview_Total_OutflowInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_total_outflow = /** @type {((inputs?: Overview_Total_OutflowInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Total_OutflowInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_total_outflow(inputs)
	return __en.overview_total_outflow(inputs)
});
/**
* | output |
* | --- |
* | "Net spending without exceptional transactions" |
*
* @param {Overview_Trend_HintInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_trend_hint = /** @type {((inputs?: Overview_Trend_HintInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Trend_HintInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_trend_hint(inputs)
	return __en.overview_trend_hint(inputs)
});
/**
* | output |
* | --- |
* | "Last 12 months" |
*
* @param {Overview_Trend_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_trend_title = /** @type {((inputs?: Overview_Trend_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Trend_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_trend_title(inputs)
	return __en.overview_trend_title(inputs)
});
/**
* | output |
* | --- |
* | "{change} vs. typical" |
*
* @param {Overview_Vs_TypicalInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const overview_vs_typical = /** @type {((inputs: Overview_Vs_TypicalInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Overview_Vs_TypicalInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.overview_vs_typical(inputs)
	return __en.overview_vs_typical(inputs)
});
/**
* | output |
* | --- |
* | "{page} · Expense Tracker" |
*
* @param {Page_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const page_title = /** @type {((inputs: Page_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Page_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.page_title(inputs)
	return __en.page_title(inputs)
});
/**
* | output |
* | --- |
* | "{category}: {change} per day vs. the 3 months before" |
*
* @param {Pattern_DriftInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const pattern_drift = /** @type {((inputs: Pattern_DriftInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pattern_DriftInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.pattern_drift(inputs)
	return __en.pattern_drift(inputs)
});
/**
* | output |
* | --- |
* | "{name}: {count}× in 3 months, ⌀ {average}" |
*
* @param {Pattern_RecurringInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const pattern_recurring = /** @type {((inputs: Pattern_RecurringInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pattern_RecurringInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.pattern_recurring(inputs)
	return __en.pattern_recurring(inputs)
});
/**
* | output |
* | --- |
* | "{share} of {category} spending falls on {first}–{last}" |
*
* @param {Pattern_RhythmInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const pattern_rhythm = /** @type {((inputs: Pattern_RhythmInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pattern_RhythmInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.pattern_rhythm(inputs)
	return __en.pattern_rhythm(inputs)
});
/**
* | output |
* | --- |
* | "{count} purchases under {limit} add up to {total}" |
*
* @param {Pattern_SmallInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const pattern_small = /** @type {((inputs: Pattern_SmallInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pattern_SmallInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.pattern_small(inputs)
	return __en.pattern_small(inputs)
});
/**
* | output |
* | --- |
* | "{count} purchases under {limit} add up to {total}, many at {name}" |
*
* @param {Pattern_Small_TopInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const pattern_small_top = /** @type {((inputs: Pattern_Small_TopInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pattern_Small_TopInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.pattern_small_top(inputs)
	return __en.pattern_small_top(inputs)
});
/**
* | output |
* | --- |
* | "Last 3 months, without exceptional transactions" |
*
* @param {Patterns_HintInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const patterns_hint = /** @type {((inputs?: Patterns_HintInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Patterns_HintInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.patterns_hint(inputs)
	return __en.patterns_hint(inputs)
});
/**
* | output |
* | --- |
* | "Patterns" |
*
* @param {Patterns_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const patterns_title = /** @type {((inputs?: Patterns_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Patterns_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.patterns_title(inputs)
	return __en.patterns_title(inputs)
});
/**
* | output |
* | --- |
* | "Period" |
*
* @param {PeriodInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period = /** @type {((inputs?: PeriodInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<PeriodInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period(inputs)
	return __en.period(inputs)
});
/**
* | output |
* | --- |
* | "Any time" |
*
* @param {Period_AnyInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period_any = /** @type {((inputs?: Period_AnyInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Period_AnyInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period_any(inputs)
	return __en.period_any(inputs)
});
/**
* | output |
* | --- |
* | "Choose the period to search" |
*
* @param {Period_Choose_SearchInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period_choose_search = /** @type {((inputs?: Period_Choose_SearchInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Period_Choose_SearchInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period_choose_search(inputs)
	return __en.period_choose_search(inputs)
});
/**
* | output |
* | --- |
* | "Custom period" |
*
* @param {Period_CustomInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period_custom = /** @type {((inputs?: Period_CustomInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Period_CustomInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period_custom(inputs)
	return __en.period_custom(inputs)
});
/**
* | output |
* | --- |
* | "Older than 6 months" |
*
* @param {Period_Older_Than_Half_YearInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period_older_than_half_year = /** @type {((inputs?: Period_Older_Than_Half_YearInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Period_Older_Than_Half_YearInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period_older_than_half_year(inputs)
	return __en.period_older_than_half_year(inputs)
});
/**
* | output |
* | --- |
* | "Older than a month" |
*
* @param {Period_Older_Than_MonthInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period_older_than_month = /** @type {((inputs?: Period_Older_Than_MonthInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Period_Older_Than_MonthInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period_older_than_month(inputs)
	return __en.period_older_than_month(inputs)
});
/**
* | output |
* | --- |
* | "Older than a week" |
*
* @param {Period_Older_Than_WeekInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period_older_than_week = /** @type {((inputs?: Period_Older_Than_WeekInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Period_Older_Than_WeekInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period_older_than_week(inputs)
	return __en.period_older_than_week(inputs)
});
/**
* | output |
* | --- |
* | "Older than a year" |
*
* @param {Period_Older_Than_YearInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period_older_than_year = /** @type {((inputs?: Period_Older_Than_YearInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Period_Older_Than_YearInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period_older_than_year(inputs)
	return __en.period_older_than_year(inputs)
});
/**
* | output |
* | --- |
* | "Ready to work offline" |
*
* @param {Pwa_Offline_ReadyInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const pwa_offline_ready = /** @type {((inputs?: Pwa_Offline_ReadyInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pwa_Offline_ReadyInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.pwa_offline_ready(inputs)
	return __en.pwa_offline_ready(inputs)
});
/**
* | output |
* | --- |
* | "A new version is available. Reload to update." |
*
* @param {Pwa_Update_AvailableInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const pwa_update_available = /** @type {((inputs?: Pwa_Update_AvailableInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pwa_Update_AvailableInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.pwa_update_available(inputs)
	return __en.pwa_update_available(inputs)
});
/**
* | output |
* | --- |
* | "Please wait until all changes are synced." |
*
* @param {Pwa_Wait_For_SyncInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const pwa_wait_for_sync = /** @type {((inputs?: Pwa_Wait_For_SyncInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pwa_Wait_For_SyncInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.pwa_wait_for_sync(inputs)
	return __en.pwa_wait_for_sync(inputs)
});
/**
* | output |
* | --- |
* | "Amount" |
*
* @param {Sankey_Amount_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_amount_placeholder = /** @type {((inputs?: Sankey_Amount_PlaceholderInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_Amount_PlaceholderInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_amount_placeholder(inputs)
	return __en.sankey_amount_placeholder(inputs)
});
/**
* | output |
* | --- |
* | "Enter the month and year to export, along with income sources and fixed costs." |
*
* @param {Sankey_DescriptionInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_description = /** @type {((inputs?: Sankey_DescriptionInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_DescriptionInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_description(inputs)
	return __en.sankey_description(inputs)
});
/**
* | output |
* | --- |
* | "Name (e.g., job)" |
*
* @param {Sankey_Income_Source_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_income_source_placeholder = /** @type {((inputs?: Sankey_Income_Source_PlaceholderInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_Income_Source_PlaceholderInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_income_source_placeholder(inputs)
	return __en.sankey_income_source_placeholder(inputs)
});
/**
* | output |
* | --- |
* | "Income Sources" |
*
* @param {Sankey_Income_SourcesInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_income_sources = /** @type {((inputs?: Sankey_Income_SourcesInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_Income_SourcesInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_income_sources(inputs)
	return __en.sankey_income_sources(inputs)
});
/**
* | output |
* | --- |
* | "Please enter a valid month (1-12) and year" |
*
* @param {Sankey_Invalid_MonthInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_invalid_month = /** @type {((inputs?: Sankey_Invalid_MonthInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_Invalid_MonthInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_invalid_month(inputs)
	return __en.sankey_invalid_month(inputs)
});
/**
* | output |
* | --- |
* | "Could not load the data for the export" |
*
* @param {Sankey_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_load_failed = /** @type {((inputs?: Sankey_Load_FailedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_Load_FailedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_load_failed(inputs)
	return __en.sankey_load_failed(inputs)
});
/**
* | output |
* | --- |
* | "Month (1-12)" |
*
* @param {Sankey_MonthInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_month = /** @type {((inputs?: Sankey_MonthInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_MonthInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_month(inputs)
	return __en.sankey_month(inputs)
});
/**
* | output |
* | --- |
* | "e.g., 11" |
*
* @param {Sankey_Month_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_month_placeholder = /** @type {((inputs?: Sankey_Month_PlaceholderInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_Month_PlaceholderInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_month_placeholder(inputs)
	return __en.sankey_month_placeholder(inputs)
});
/**
* | output |
* | --- |
* | "Summarize" |
*
* @param {Sankey_OpenInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_open = /** @type {((inputs?: Sankey_OpenInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_OpenInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_open(inputs)
	return __en.sankey_open(inputs)
});
/**
* | output |
* | --- |
* | "Name (e.g., bitcoin)" |
*
* @param {Sankey_Savings_Target_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_savings_target_placeholder = /** @type {((inputs?: Sankey_Savings_Target_PlaceholderInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_Savings_Target_PlaceholderInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_savings_target_placeholder(inputs)
	return __en.sankey_savings_target_placeholder(inputs)
});
/**
* | output |
* | --- |
* | "Savings Targets" |
*
* @param {Sankey_Savings_TargetsInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_savings_targets = /** @type {((inputs?: Sankey_Savings_TargetsInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_Savings_TargetsInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_savings_targets(inputs)
	return __en.sankey_savings_targets(inputs)
});
/**
* | output |
* | --- |
* | "Export Month as Sankey Diagram" |
*
* @param {Sankey_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_title = /** @type {((inputs?: Sankey_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_title(inputs)
	return __en.sankey_title(inputs)
});
/**
* | output |
* | --- |
* | "Year" |
*
* @param {Sankey_YearInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_year = /** @type {((inputs?: Sankey_YearInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_YearInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_year(inputs)
	return __en.sankey_year(inputs)
});
/**
* | output |
* | --- |
* | "e.g., 2025" |
*
* @param {Sankey_Year_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sankey_year_placeholder = /** @type {((inputs?: Sankey_Year_PlaceholderInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sankey_Year_PlaceholderInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sankey_year_placeholder(inputs)
	return __en.sankey_year_placeholder(inputs)
});
/**
* | output |
* | --- |
* | "Results from all months" |
*
* @param {Search_All_MonthsInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const search_all_months = /** @type {((inputs?: Search_All_MonthsInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_All_MonthsInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.search_all_months(inputs)
	return __en.search_all_months(inputs)
});
/**
* | output |
* | --- |
* | "Clear search" |
*
* @param {Search_ClearInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const search_clear = /** @type {((inputs?: Search_ClearInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_ClearInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.search_clear(inputs)
	return __en.search_clear(inputs)
});
/**
* | output |
* | --- |
* | "Search" |
*
* @param {Search_LabelInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const search_label = /** @type {((inputs?: Search_LabelInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_LabelInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.search_label(inputs)
	return __en.search_label(inputs)
});
/**
* | output |
* | --- |
* | "Load more" |
*
* @param {Search_Load_MoreInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const search_load_more = /** @type {((inputs?: Search_Load_MoreInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_Load_MoreInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.search_load_more(inputs)
	return __en.search_load_more(inputs)
});
/**
* | output |
* | --- |
* | "No results" |
*
* @param {Search_No_ResultsInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const search_no_results = /** @type {((inputs?: Search_No_ResultsInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_No_ResultsInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.search_no_results(inputs)
	return __en.search_no_results(inputs)
});
/**
* | output |
* | --- |
* | "Search isn't available offline." |
*
* @param {Search_OfflineInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const search_offline = /** @type {((inputs?: Search_OfflineInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_OfflineInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.search_offline(inputs)
	return __en.search_offline(inputs)
});
/**
* | output |
* | --- |
* | "Search transactions" |
*
* @param {Search_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const search_placeholder = /** @type {((inputs?: Search_PlaceholderInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_PlaceholderInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.search_placeholder(inputs)
	return __en.search_placeholder(inputs)
});
/**
* | output |
* | --- |
* | "Download all your transactions, categories and fixed costs as a file. You can import it into a new account later." |
*
* @param {Settings_Export_DescriptionInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_export_description = /** @type {((inputs?: Settings_Export_DescriptionInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Export_DescriptionInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_export_description(inputs)
	return __en.settings_export_description(inputs)
});
/**
* | output |
* | --- |
* | "The export failed." |
*
* @param {Settings_Export_FailedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_export_failed = /** @type {((inputs?: Settings_Export_FailedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Export_FailedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_export_failed(inputs)
	return __en.settings_export_failed(inputs)
});
/**
* | output |
* | --- |
* | "Import an export. This replaces your categories. If your account already has transactions or fixed costs, you can replace everything with the file." |
*
* @param {Settings_Import_DescriptionInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_import_description = /** @type {((inputs?: Settings_Import_DescriptionInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Import_DescriptionInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_import_description(inputs)
	return __en.settings_import_description(inputs)
});
/**
* | output |
* | --- |
* | "The import failed. Please try again." |
*
* @param {Settings_Import_FailedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_import_failed = /** @type {((inputs?: Settings_Import_FailedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Import_FailedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_import_failed(inputs)
	return __en.settings_import_failed(inputs)
});
/**
* | output |
* | --- |
* | "The file is not a valid backup." |
*
* @param {Settings_Import_Invalid_FileInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_import_invalid_file = /** @type {((inputs?: Settings_Import_Invalid_FileInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Import_Invalid_FileInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_import_invalid_file(inputs)
	return __en.settings_import_invalid_file(inputs)
});
/**
* | output |
* | --- |
* | "The file is not a valid backup ({issue})." |
*
* @param {Settings_Import_Invalid_File_DetailInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_import_invalid_file_detail = /** @type {((inputs: Settings_Import_Invalid_File_DetailInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Import_Invalid_File_DetailInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_import_invalid_file_detail(inputs)
	return __en.settings_import_invalid_file_detail(inputs)
});
/**
* | output |
* | --- |
* | "Your account already contains data. The import deletes all transactions, fixed costs and categories and replaces them with those from the file. This can't be..." |
*
* @param {Settings_Import_Replace_DescriptionInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_import_replace_description = /** @type {((inputs?: Settings_Import_Replace_DescriptionInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Import_Replace_DescriptionInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_import_replace_description(inputs)
	return __en.settings_import_replace_description(inputs)
});
/**
* | output |
* | --- |
* | "Replace all data?" |
*
* @param {Settings_Import_Replace_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_import_replace_title = /** @type {((inputs?: Settings_Import_Replace_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Import_Replace_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_import_replace_title(inputs)
	return __en.settings_import_replace_title(inputs)
});
/**
* | output |
* | --- |
* | "Imported. Transactions: {transactions}, fixed costs: {fixedCosts}." |
*
* @param {Settings_Import_SuccessInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_import_success = /** @type {((inputs: Settings_Import_SuccessInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Import_SuccessInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_import_success(inputs)
	return __en.settings_import_success(inputs)
});
/**
* | output |
* | --- |
* | "Language" |
*
* @param {Settings_LanguageInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_language = /** @type {((inputs?: Settings_LanguageInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_LanguageInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_language(inputs)
	return __en.settings_language(inputs)
});
/**
* | output |
* | --- |
* | "Applies to this device only." |
*
* @param {Settings_Language_DescriptionInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_language_description = /** @type {((inputs?: Settings_Language_DescriptionInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Language_DescriptionInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_language_description(inputs)
	return __en.settings_language_description(inputs)
});
/**
* | output |
* | --- |
* | "Save location" |
*
* @param {Settings_LocationInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_location = /** @type {((inputs?: Settings_LocationInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_LocationInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_location(inputs)
	return __en.settings_location(inputs)
});
/**
* | output |
* | --- |
* | "Location access is blocked. Allow it for this app in your browser or system settings." |
*
* @param {Settings_Location_DeniedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_location_denied = /** @type {((inputs?: Settings_Location_DeniedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Location_DeniedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_location_denied(inputs)
	return __en.settings_location_denied(inputs)
});
/**
* | output |
* | --- |
* | "New transactions save where this device was when you created them. Applies to this device only." |
*
* @param {Settings_Location_DescriptionInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_location_description = /** @type {((inputs?: Settings_Location_DescriptionInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Location_DescriptionInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_location_description(inputs)
	return __en.settings_location_description(inputs)
});
/**
* | output |
* | --- |
* | "Settings" |
*
* @param {Settings_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const settings_title = /** @type {((inputs?: Settings_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.settings_title(inputs)
	return __en.settings_title(inputs)
});
/**
* | output |
* | --- |
* | "Sign out anyway?" |
*
* @param {Sign_Out_Anyway_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sign_out_anyway_title = /** @type {((inputs?: Sign_Out_Anyway_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sign_Out_Anyway_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sign_out_anyway_title(inputs)
	return __en.sign_out_anyway_title(inputs)
});
/**
* | output |
* | --- |
* | "Sign-out failed. Please try again." |
*
* @param {Sign_Out_FailedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sign_out_failed = /** @type {((inputs?: Sign_Out_FailedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sign_Out_FailedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sign_out_failed(inputs)
	return __en.sign_out_failed(inputs)
});
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} change hasn't been synced yet and will be lost when you sign out." |
* | "other" | "{count} changes haven't been synced yet and will be lost when you sign out." |
*
* @param {Sign_Out_Unsynced_ChangesInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sign_out_unsynced_changes = /** @type {((inputs: Sign_Out_Unsynced_ChangesInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sign_Out_Unsynced_ChangesInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sign_out_unsynced_changes(inputs)
	return __en.sign_out_unsynced_changes(inputs)
});
/**
* | output |
* | --- |
* | "Deleted" |
*
* @param {Sync_Action_DeletedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_action_deleted = /** @type {((inputs?: Sync_Action_DeletedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Action_DeletedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_action_deleted(inputs)
	return __en.sync_action_deleted(inputs)
});
/**
* | output |
* | --- |
* | "Saved" |
*
* @param {Sync_Action_SavedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_action_saved = /** @type {((inputs?: Sync_Action_SavedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Action_SavedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_action_saved(inputs)
	return __en.sync_action_saved(inputs)
});
/**
* | output |
* | --- |
* | "will sync once you're online" |
*
* @param {Sync_Later_HintInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_later_hint = /** @type {((inputs?: Sync_Later_HintInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Later_HintInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_later_hint(inputs)
	return __en.sync_later_hint(inputs)
});
/**
* | output |
* | --- |
* | "{count} rejected" |
*
* @param {Sync_Menu_FailedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_menu_failed = /** @type {((inputs: Sync_Menu_FailedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Menu_FailedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_menu_failed(inputs)
	return __en.sync_menu_failed(inputs)
});
/**
* | output |
* | --- |
* | "Offline" |
*
* @param {Sync_Menu_OfflineInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_menu_offline = /** @type {((inputs?: Sync_Menu_OfflineInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Menu_OfflineInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_menu_offline(inputs)
	return __en.sync_menu_offline(inputs)
});
/**
* | output |
* | --- |
* | "Offline · {count} pending" |
*
* @param {Sync_Menu_Offline_PendingInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_menu_offline_pending = /** @type {((inputs: Sync_Menu_Offline_PendingInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Menu_Offline_PendingInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_menu_offline_pending(inputs)
	return __en.sync_menu_offline_pending(inputs)
});
/**
* | output |
* | --- |
* | "{count} pending" |
*
* @param {Sync_Menu_PendingInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_menu_pending = /** @type {((inputs: Sync_Menu_PendingInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Menu_PendingInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_menu_pending(inputs)
	return __en.sync_menu_pending(inputs)
});
/**
* | output |
* | --- |
* | "All synced" |
*
* @param {Sync_Menu_SyncedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_menu_synced = /** @type {((inputs?: Sync_Menu_SyncedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Menu_SyncedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_menu_synced(inputs)
	return __en.sync_menu_synced(inputs)
});
/**
* | output |
* | --- |
* | "Not synced yet" |
*
* @param {Sync_Not_Synced_YetInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_not_synced_yet = /** @type {((inputs?: Sync_Not_Synced_YetInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Not_Synced_YetInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_not_synced_yet(inputs)
	return __en.sync_not_synced_yet(inputs)
});
/**
* | output |
* | --- |
* | "Sync now" |
*
* @param {Sync_NowInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_now = /** @type {((inputs?: Sync_NowInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_NowInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_now(inputs)
	return __en.sync_now(inputs)
});
/**
* | output |
* | --- |
* | "Pending" |
*
* @param {Sync_PendingInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_pending = /** @type {((inputs?: Sync_PendingInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_PendingInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_pending(inputs)
	return __en.sync_pending(inputs)
});
/**
* | output |
* | --- |
* | "Rejected" |
*
* @param {Sync_RejectedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_rejected = /** @type {((inputs?: Sync_RejectedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_RejectedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_rejected(inputs)
	return __en.sync_rejected(inputs)
});
/**
* | output |
* | --- |
* | "The server rejected the change ({status})." |
*
* @param {Sync_Rejected_StatusInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_rejected_status = /** @type {((inputs: Sync_Rejected_StatusInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Rejected_StatusInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_rejected_status(inputs)
	return __en.sync_rejected_status(inputs)
});
/**
* | output |
* | --- |
* | "The server can't be reached right now." |
*
* @param {Sync_Server_UnreachableInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_server_unreachable = /** @type {((inputs?: Sync_Server_UnreachableInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Server_UnreachableInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_server_unreachable(inputs)
	return __en.sync_server_unreachable(inputs)
});
/**
* | output |
* | --- |
* | "Some changes were rejected." |
*
* @param {Sync_Status_FailedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_status_failed = /** @type {((inputs?: Sync_Status_FailedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Status_FailedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_status_failed(inputs)
	return __en.sync_status_failed(inputs)
});
/**
* | output |
* | --- |
* | "Offline – changes will be sent later." |
*
* @param {Sync_Status_OfflineInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_status_offline = /** @type {((inputs?: Sync_Status_OfflineInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Status_OfflineInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_status_offline(inputs)
	return __en.sync_status_offline(inputs)
});
/**
* | output |
* | --- |
* | "Syncing …" |
*
* @param {Sync_Status_PendingInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_status_pending = /** @type {((inputs?: Sync_Status_PendingInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Status_PendingInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_status_pending(inputs)
	return __en.sync_status_pending(inputs)
});
/**
* | output |
* | --- |
* | "All synced." |
*
* @param {Sync_Status_SyncedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_status_synced = /** @type {((inputs?: Sync_Status_SyncedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_Status_SyncedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_status_synced(inputs)
	return __en.sync_status_synced(inputs)
});
/**
* | output |
* | --- |
* | "Sync" |
*
* @param {Sync_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const sync_title = /** @type {((inputs?: Sync_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sync_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.sync_title(inputs)
	return __en.sync_title(inputs)
});
/**
* | output |
* | --- |
* | "Amount" |
*
* @param {Transaction_AmountInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_amount = /** @type {((inputs?: Transaction_AmountInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_AmountInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_amount(inputs)
	return __en.transaction_amount(inputs)
});
/**
* | output |
* | --- |
* | "Same as last time: {amount}" |
*
* @param {Transaction_Amount_LastInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_amount_last = /** @type {((inputs: Transaction_Amount_LastInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Amount_LastInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_amount_last(inputs)
	return __en.transaction_amount_last(inputs)
});
/**
* | output |
* | --- |
* | "Enter an amount." |
*
* @param {Transaction_Amount_MissingInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_amount_missing = /** @type {((inputs?: Transaction_Amount_MissingInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Amount_MissingInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_amount_missing(inputs)
	return __en.transaction_amount_missing(inputs)
});
/**
* | output |
* | --- |
* | "Category" |
*
* @param {Transaction_CategoryInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_category = /** @type {((inputs?: Transaction_CategoryInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_CategoryInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_category(inputs)
	return __en.transaction_category(inputs)
});
/**
* | output |
* | --- |
* | "Choose a category." |
*
* @param {Transaction_Category_MissingInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_category_missing = /** @type {((inputs?: Transaction_Category_MissingInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Category_MissingInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_category_missing(inputs)
	return __en.transaction_category_missing(inputs)
});
/**
* | output |
* | --- |
* | "Choose date" |
*
* @param {Transaction_Choose_DateInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_choose_date = /** @type {((inputs?: Transaction_Choose_DateInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Choose_DateInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_choose_date(inputs)
	return __en.transaction_choose_date(inputs)
});
/**
* | output |
* | --- |
* | "From “{raw}”" |
*
* @param {Transaction_Counterparty_AliasedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_counterparty_aliased = /** @type {((inputs: Transaction_Counterparty_AliasedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Counterparty_AliasedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_counterparty_aliased(inputs)
	return __en.transaction_counterparty_aliased(inputs)
});
/**
* | output |
* | --- |
* | "Where?" |
*
* @param {Transaction_Counterparty_ExpenseInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_counterparty_expense = /** @type {((inputs?: Transaction_Counterparty_ExpenseInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Counterparty_ExpenseInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_counterparty_expense(inputs)
	return __en.transaction_counterparty_expense(inputs)
});
/**
* | output |
* | --- |
* | "From whom?" |
*
* @param {Transaction_Counterparty_IncomeInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_counterparty_income = /** @type {((inputs?: Transaction_Counterparty_IncomeInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Counterparty_IncomeInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_counterparty_income(inputs)
	return __en.transaction_counterparty_income(inputs)
});
/**
* | output |
* | --- |
* | "Enter where or from whom." |
*
* @param {Transaction_Counterparty_MissingInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_counterparty_missing = /** @type {((inputs?: Transaction_Counterparty_MissingInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Counterparty_MissingInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_counterparty_missing(inputs)
	return __en.transaction_counterparty_missing(inputs)
});
/**
* | output |
* | --- |
* | "Use “{name}”" |
*
* @param {Transaction_Counterparty_UseInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_counterparty_use = /** @type {((inputs: Transaction_Counterparty_UseInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Counterparty_UseInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_counterparty_use(inputs)
	return __en.transaction_counterparty_use(inputs)
});
/**
* | output |
* | --- |
* | "Date" |
*
* @param {Transaction_DateInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_date = /** @type {((inputs?: Transaction_DateInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_DateInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_date(inputs)
	return __en.transaction_date(inputs)
});
/**
* | output |
* | --- |
* | "Today" |
*
* @param {Transaction_Date_TodayInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_date_today = /** @type {((inputs?: Transaction_Date_TodayInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Date_TodayInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_date_today(inputs)
	return __en.transaction_date_today(inputs)
});
/**
* | output |
* | --- |
* | "Yesterday" |
*
* @param {Transaction_Date_YesterdayInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_date_yesterday = /** @type {((inputs?: Transaction_Date_YesterdayInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Date_YesterdayInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_date_yesterday(inputs)
	return __en.transaction_date_yesterday(inputs)
});
/**
* | output |
* | --- |
* | "This can't be undone. The transaction will be removed from the history." |
*
* @param {Transaction_Delete_DescriptionInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_delete_description = /** @type {((inputs?: Transaction_Delete_DescriptionInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Delete_DescriptionInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_delete_description(inputs)
	return __en.transaction_delete_description(inputs)
});
/**
* | output |
* | --- |
* | "Delete transaction?" |
*
* @param {Transaction_Delete_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_delete_title = /** @type {((inputs?: Transaction_Delete_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Delete_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_delete_title(inputs)
	return __en.transaction_delete_title(inputs)
});
/**
* | output |
* | --- |
* | "Description" |
*
* @param {Transaction_DescriptionInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_description = /** @type {((inputs?: Transaction_DescriptionInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_DescriptionInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_description(inputs)
	return __en.transaction_description(inputs)
});
/**
* | output |
* | --- |
* | "Edit transaction" |
*
* @param {Transaction_EditInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_edit = /** @type {((inputs?: Transaction_EditInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_EditInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_edit(inputs)
	return __en.transaction_edit(inputs)
});
/**
* | output |
* | --- |
* | "Exceptional" |
*
* @param {Transaction_ExceptionalInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_exceptional = /** @type {((inputs?: Transaction_ExceptionalInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_ExceptionalInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_exceptional(inputs)
	return __en.transaction_exceptional(inputs)
});
/**
* | output |
* | --- |
* | "The expense was deleted." |
*
* @param {Transaction_Expense_DeletedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_expense_deleted = /** @type {((inputs?: Transaction_Expense_DeletedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Expense_DeletedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_expense_deleted(inputs)
	return __en.transaction_expense_deleted(inputs)
});
/**
* | output |
* | --- |
* | "Expense at {name} saved" |
*
* @param {Transaction_Expense_SavedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_expense_saved = /** @type {((inputs: Transaction_Expense_SavedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Expense_SavedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_expense_saved(inputs)
	return __en.transaction_expense_saved(inputs)
});
/**
* | output |
* | --- |
* | "{count} expenses at {name} saved" |
*
* @param {Transaction_Expenses_SavedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_expenses_saved = /** @type {((inputs: Transaction_Expenses_SavedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Expenses_SavedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_expenses_saved(inputs)
	return __en.transaction_expenses_saved(inputs)
});
/**
* | output |
* | --- |
* | "Track" |
*
* @param {Transaction_FabInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_fab = /** @type {((inputs?: Transaction_FabInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_FabInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_fab(inputs)
	return __en.transaction_fab(inputs)
});
/**
* | output |
* | --- |
* | "Filter by category" |
*
* @param {Transaction_FilterInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_filter = /** @type {((inputs?: Transaction_FilterInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_FilterInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_filter(inputs)
	return __en.transaction_filter(inputs)
});
/**
* | output |
* | --- |
* | "Category filter active: {category}" |
*
* @param {Transaction_Filter_ActiveInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_filter_active = /** @type {((inputs: Transaction_Filter_ActiveInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Filter_ActiveInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_filter_active(inputs)
	return __en.transaction_filter_active(inputs)
});
/**
* | output |
* | --- |
* | "All categories" |
*
* @param {Transaction_Filter_AllInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_filter_all = /** @type {((inputs?: Transaction_Filter_AllInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Filter_AllInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_filter_all(inputs)
	return __en.transaction_filter_all(inputs)
});
/**
* | output |
* | --- |
* | "The income was deleted." |
*
* @param {Transaction_Income_DeletedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_income_deleted = /** @type {((inputs?: Transaction_Income_DeletedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Income_DeletedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_income_deleted(inputs)
	return __en.transaction_income_deleted(inputs)
});
/**
* | output |
* | --- |
* | "Income from {name} saved" |
*
* @param {Transaction_Income_SavedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_income_saved = /** @type {((inputs: Transaction_Income_SavedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Income_SavedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_income_saved(inputs)
	return __en.transaction_income_saved(inputs)
});
/**
* | output |
* | --- |
* | "{count} incomes from {name} saved" |
*
* @param {Transaction_Incomes_SavedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_incomes_saved = /** @type {((inputs: Transaction_Incomes_SavedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Incomes_SavedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_incomes_saved(inputs)
	return __en.transaction_incomes_saved(inputs)
});
/**
* | output |
* | --- |
* | "No transactions ({period})" |
*
* @param {Transaction_List_EmptyInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_list_empty = /** @type {((inputs: Transaction_List_EmptyInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_List_EmptyInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_list_empty(inputs)
	return __en.transaction_list_empty(inputs)
});
/**
* | output |
* | --- |
* | "Loading transactions" |
*
* @param {Transaction_List_LoadingInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_list_loading = /** @type {((inputs?: Transaction_List_LoadingInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_List_LoadingInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_list_loading(inputs)
	return __en.transaction_list_loading(inputs)
});
/**
* | output |
* | --- |
* | "Offline – this month hasn't been loaded yet" |
*
* @param {Transaction_List_OfflineInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_list_offline = /** @type {((inputs?: Transaction_List_OfflineInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_List_OfflineInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_list_offline(inputs)
	return __en.transaction_list_offline(inputs)
});
/**
* | output |
* | --- |
* | "Upcoming" |
*
* @param {Transaction_List_UpcomingInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_list_upcoming = /** @type {((inputs?: Transaction_List_UpcomingInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_List_UpcomingInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_list_upcoming(inputs)
	return __en.transaction_list_upcoming(inputs)
});
/**
* | output |
* | --- |
* | "More details" |
*
* @param {Transaction_MoreInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_more = /** @type {((inputs?: Transaction_MoreInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_MoreInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_more(inputs)
	return __en.transaction_more(inputs)
});
/**
* | output |
* | --- |
* | "New transaction" |
*
* @param {Transaction_NewInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_new = /** @type {((inputs?: Transaction_NewInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_NewInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_new(inputs)
	return __en.transaction_new(inputs)
});
/**
* | output |
* | --- |
* | "No description" |
*
* @param {Transaction_No_DescriptionInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_no_description = /** @type {((inputs?: Transaction_No_DescriptionInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_No_DescriptionInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_no_description(inputs)
	return __en.transaction_no_description(inputs)
});
/**
* | output |
* | --- |
* | "Transaction not found." |
*
* @param {Transaction_Not_FoundInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_not_found = /** @type {((inputs?: Transaction_Not_FoundInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Not_FoundInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_not_found(inputs)
	return __en.transaction_not_found(inputs)
});
/**
* | output |
* | --- |
* | "Split" |
*
* @param {Transaction_SplitInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_split = /** @type {((inputs?: Transaction_SplitInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_SplitInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_split(inputs)
	return __en.transaction_split(inputs)
});
/**
* | output |
* | --- |
* | "Description (optional)" |
*
* @param {Transaction_Split_DescriptionInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_split_description = /** @type {((inputs?: Transaction_Split_DescriptionInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Split_DescriptionInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_split_description(inputs)
	return __en.transaction_split_description(inputs)
});
/**
* | output |
* | --- |
* | "Stays in {category}: {amount}" |
*
* @param {Transaction_Split_RemainderInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_split_remainder = /** @type {((inputs: Transaction_Split_RemainderInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Split_RemainderInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_split_remainder(inputs)
	return __en.transaction_split_remainder(inputs)
});
/**
* | output |
* | --- |
* | "Stays in the main category: {amount}" |
*
* @param {Transaction_Split_Remainder_UncategorizedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_split_remainder_uncategorized = /** @type {((inputs: Transaction_Split_Remainder_UncategorizedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Split_Remainder_UncategorizedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_split_remainder_uncategorized(inputs)
	return __en.transaction_split_remainder_uncategorized(inputs)
});
/**
* | output |
* | --- |
* | "Remove part" |
*
* @param {Transaction_Split_RemoveInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_split_remove = /** @type {((inputs?: Transaction_Split_RemoveInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Split_RemoveInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_split_remove(inputs)
	return __en.transaction_split_remove(inputs)
});
/**
* | output |
* | --- |
* | "Nothing is left for the main category. Remove a part or lower its amount." |
*
* @param {Transaction_Split_Too_MuchInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_split_too_much = /** @type {((inputs?: Transaction_Split_Too_MuchInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Split_Too_MuchInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_split_too_much(inputs)
	return __en.transaction_split_too_much(inputs)
});
/**
* | output |
* | --- |
* | "Transaction updated" |
*
* @param {Transaction_UpdatedInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_updated = /** @type {((inputs?: Transaction_UpdatedInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_UpdatedInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_updated(inputs)
	return __en.transaction_updated(inputs)
});