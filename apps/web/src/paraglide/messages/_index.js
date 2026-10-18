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
/** @typedef {{}} Api_Error_Invalid_FileInputs */
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
/** @typedef {{}} Fixed_Cost_ActiveInputs */
/** @typedef {{}} Fixed_Cost_AddInputs */
/** @typedef {{}} Fixed_Cost_AmountInputs */
/** @typedef {{}} Fixed_Cost_Amount_EurInputs */
/** @typedef {{}} Fixed_Cost_CategoriesInputs */
/** @typedef {{}} Fixed_Cost_CategoryInputs */
/** @typedef {{}} Fixed_Cost_Choose_CategoryInputs */
/** @typedef {{}} Fixed_Cost_Choose_Start_DateInputs */
/** @typedef {{ name: NonNullable<unknown> }} Fixed_Cost_CreatedInputs */
/** @typedef {{}} Fixed_Cost_Delete_ConfirmInputs */
/** @typedef {{}} Fixed_Cost_Delete_FailedInputs */
/** @typedef {{}} Fixed_Cost_EditInputs */
/** @typedef {{}} Fixed_Cost_End_DateInputs */
/** @typedef {{}} Fixed_Cost_End_Date_HintInputs */
/** @typedef {{}} Fixed_Cost_End_Date_OptionalInputs */
/** @typedef {{}} Fixed_Cost_IntervalInputs */
/** @typedef {{}} Fixed_Cost_Interval_MonthlyInputs */
/** @typedef {{}} Fixed_Cost_Interval_QuarterlyInputs */
/** @typedef {{}} Fixed_Cost_Interval_YearlyInputs */
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
/** @typedef {{}} Fixed_Costs_TitleInputs */
/** @typedef {{}} Insights_Distribution_TitleInputs */
/** @typedef {{ count: NonNullable<unknown> }} Insights_Expense_CountInputs */
/** @typedef {{}} Insights_MoreInputs */
/** @typedef {{}} Insights_Newer_MonthInputs */
/** @typedef {{}} Insights_Older_MonthInputs */
/** @typedef {{ amount: NonNullable<unknown> }} Insights_Per_ExpenseInputs */
/** @typedef {{}} Insights_Per_MonthInputs */
/** @typedef {{}} Insights_Spent_This_MonthInputs */
/** @typedef {{}} Insights_Spent_TodayInputs */
/** @typedef {{}} Insights_Spent_YesterdayInputs */
/** @typedef {{}} Insights_Trend_DayInputs */
/** @typedef {{}} Insights_Trend_Spike_CategoryInputs */
/** @typedef {{ date: NonNullable<unknown> }} Insights_Trend_Spike_DateInputs */
/** @typedef {{}} Insights_Trend_TitleInputs */
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
/** @typedef {{}} Offline_UnavailableInputs */
/** @typedef {{}} PeriodInputs */
/** @typedef {{}} Period_AnyInputs */
/** @typedef {{}} Period_Choose_ListInputs */
/** @typedef {{}} Period_Choose_SearchInputs */
/** @typedef {{}} Period_CustomInputs */
/** @typedef {{}} Period_Last_7_DaysInputs */
/** @typedef {{}} Period_Older_Than_Half_YearInputs */
/** @typedef {{}} Period_Older_Than_MonthInputs */
/** @typedef {{}} Period_Older_Than_WeekInputs */
/** @typedef {{}} Period_Older_Than_YearInputs */
/** @typedef {{}} Period_TodayInputs */
/** @typedef {{}} Period_YesterdayInputs */
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
/** @typedef {{ issue: NonNullable<unknown> }} Settings_Import_Invalid_File_DetailInputs */
/** @typedef {{}} Settings_Import_Replace_DescriptionInputs */
/** @typedef {{}} Settings_Import_Replace_TitleInputs */
/** @typedef {{ transactions: NonNullable<unknown>, fixedCosts: NonNullable<unknown> }} Settings_Import_SuccessInputs */
/** @typedef {{}} Settings_LanguageInputs */
/** @typedef {{}} Settings_Language_DescriptionInputs */
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
/** @typedef {{}} Transaction_Choose_DateInputs */
/** @typedef {{}} Transaction_Delete_DescriptionInputs */
/** @typedef {{}} Transaction_Delete_TitleInputs */
/** @typedef {{}} Transaction_DescriptionInputs */
/** @typedef {{}} Transaction_EditInputs */
/** @typedef {{}} Transaction_ExceptionalInputs */
/** @typedef {{}} Transaction_Expense_DeletedInputs */
/** @typedef {{ name: NonNullable<unknown> }} Transaction_Expense_SavedInputs */
/** @typedef {{}} Transaction_Form_IncompleteInputs */
/** @typedef {{}} Transaction_Income_DeletedInputs */
/** @typedef {{ name: NonNullable<unknown> }} Transaction_Income_SavedInputs */
/** @typedef {{ period: NonNullable<unknown> }} Transaction_List_EmptyInputs */
/** @typedef {{}} Transaction_NewInputs */
/** @typedef {{}} Transaction_No_DescriptionInputs */
/** @typedef {{}} Transaction_Not_FoundInputs */
/** @typedef {{ name: NonNullable<unknown> }} Transaction_Remove_CategoryInputs */
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
* | "The file is not a valid backup." |
*
* @param {Api_Error_Invalid_FileInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const api_error_invalid_file = /** @type {((inputs?: Api_Error_Invalid_FileInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Api_Error_Invalid_FileInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.api_error_invalid_file(inputs)
	return __en.api_error_invalid_file(inputs)
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
* | "Active" |
*
* @param {Fixed_Cost_ActiveInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_active = /** @type {((inputs?: Fixed_Cost_ActiveInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_ActiveInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_active(inputs)
	return __en.fixed_cost_active(inputs)
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
* | "Do you really want to delete this fixed cost?" |
*
* @param {Fixed_Cost_Delete_ConfirmInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const fixed_cost_delete_confirm = /** @type {((inputs?: Fixed_Cost_Delete_ConfirmInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fixed_Cost_Delete_ConfirmInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.fixed_cost_delete_confirm(inputs)
	return __en.fixed_cost_delete_confirm(inputs)
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
* | "Monthly total:" |
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
* | "Spending by category" |
*
* @param {Insights_Distribution_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_distribution_title = /** @type {((inputs?: Insights_Distribution_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Distribution_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_distribution_title(inputs)
	return __en.insights_distribution_title(inputs)
});
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} expense" |
* | "other" | "{count} expenses" |
*
* @param {Insights_Expense_CountInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_expense_count = /** @type {((inputs: Insights_Expense_CountInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Expense_CountInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_expense_count(inputs)
	return __en.insights_expense_count(inputs)
});
/**
* | output |
* | --- |
* | "More" |
*
* @param {Insights_MoreInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_more = /** @type {((inputs?: Insights_MoreInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_MoreInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_more(inputs)
	return __en.insights_more(inputs)
});
/**
* | output |
* | --- |
* | "Newer month" |
*
* @param {Insights_Newer_MonthInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_newer_month = /** @type {((inputs?: Insights_Newer_MonthInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Newer_MonthInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_newer_month(inputs)
	return __en.insights_newer_month(inputs)
});
/**
* | output |
* | --- |
* | "Older month" |
*
* @param {Insights_Older_MonthInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_older_month = /** @type {((inputs?: Insights_Older_MonthInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Older_MonthInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_older_month(inputs)
	return __en.insights_older_month(inputs)
});
/**
* | output |
* | --- |
* | "{amount} per expense" |
*
* @param {Insights_Per_ExpenseInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_per_expense = /** @type {((inputs: Insights_Per_ExpenseInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Per_ExpenseInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_per_expense(inputs)
	return __en.insights_per_expense(inputs)
});
/**
* | output |
* | --- |
* | "Per month" |
*
* @param {Insights_Per_MonthInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_per_month = /** @type {((inputs?: Insights_Per_MonthInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Per_MonthInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_per_month(inputs)
	return __en.insights_per_month(inputs)
});
/**
* | output |
* | --- |
* | "Spent this month" |
*
* @param {Insights_Spent_This_MonthInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_spent_this_month = /** @type {((inputs?: Insights_Spent_This_MonthInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Spent_This_MonthInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_spent_this_month(inputs)
	return __en.insights_spent_this_month(inputs)
});
/**
* | output |
* | --- |
* | "Spent today" |
*
* @param {Insights_Spent_TodayInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_spent_today = /** @type {((inputs?: Insights_Spent_TodayInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Spent_TodayInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_spent_today(inputs)
	return __en.insights_spent_today(inputs)
});
/**
* | output |
* | --- |
* | "Spent yesterday" |
*
* @param {Insights_Spent_YesterdayInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_spent_yesterday = /** @type {((inputs?: Insights_Spent_YesterdayInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Spent_YesterdayInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_spent_yesterday(inputs)
	return __en.insights_spent_yesterday(inputs)
});
/**
* | output |
* | --- |
* | "Day" |
*
* @param {Insights_Trend_DayInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_trend_day = /** @type {((inputs?: Insights_Trend_DayInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Trend_DayInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_trend_day(inputs)
	return __en.insights_trend_day(inputs)
});
/**
* | output |
* | --- |
* | "Most spent on" |
*
* @param {Insights_Trend_Spike_CategoryInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_trend_spike_category = /** @type {((inputs?: Insights_Trend_Spike_CategoryInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Trend_Spike_CategoryInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_trend_spike_category(inputs)
	return __en.insights_trend_spike_category(inputs)
});
/**
* | output |
* | --- |
* | ", on {date}" |
*
* @param {Insights_Trend_Spike_DateInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_trend_spike_date = /** @type {((inputs: Insights_Trend_Spike_DateInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Trend_Spike_DateInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_trend_spike_date(inputs)
	return __en.insights_trend_spike_date(inputs)
});
/**
* | output |
* | --- |
* | "30-day trend" |
*
* @param {Insights_Trend_TitleInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const insights_trend_title = /** @type {((inputs?: Insights_Trend_TitleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insights_Trend_TitleInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.insights_trend_title(inputs)
	return __en.insights_trend_title(inputs)
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
* | "Choose the period of the transactions shown" |
*
* @param {Period_Choose_ListInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period_choose_list = /** @type {((inputs?: Period_Choose_ListInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Period_Choose_ListInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period_choose_list(inputs)
	return __en.period_choose_list(inputs)
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
* | "Last 7 days" |
*
* @param {Period_Last_7_DaysInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period_last_7_days = /** @type {((inputs?: Period_Last_7_DaysInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Period_Last_7_DaysInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period_last_7_days(inputs)
	return __en.period_last_7_days(inputs)
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
* | "Today" |
*
* @param {Period_TodayInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period_today = /** @type {((inputs?: Period_TodayInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Period_TodayInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period_today(inputs)
	return __en.period_today(inputs)
});
/**
* | output |
* | --- |
* | "Yesterday" |
*
* @param {Period_YesterdayInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const period_yesterday = /** @type {((inputs?: Period_YesterdayInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Period_YesterdayInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.period_yesterday(inputs)
	return __en.period_yesterday(inputs)
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
* | "Import an export or a backup of the old app (.db). This replaces your categories. If your account already has transactions or fixed costs, you can replace ev..." |
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
* | "Please select a category and enter an amount and a name." |
*
* @param {Transaction_Form_IncompleteInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_form_incomplete = /** @type {((inputs?: Transaction_Form_IncompleteInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Form_IncompleteInputs, { locale?: "en" | "de" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_form_incomplete(inputs)
	return __en.transaction_form_incomplete(inputs)
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
* | "Remove category {name}" |
*
* @param {Transaction_Remove_CategoryInputs} inputs
* @param {{ locale?: "en" | "de" }} options
* @returns {LocalizedString}
*/
export const transaction_remove_category = /** @type {((inputs: Transaction_Remove_CategoryInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Transaction_Remove_CategoryInputs, { locale?: "en" | "de" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "de") return __de.transaction_remove_category(inputs)
	return __en.transaction_remove_category(inputs)
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