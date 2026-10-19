/* eslint-disable */
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
/** @typedef {{}} Fixed_Cost_ActiveInputs */
/** @typedef {{}} Fixed_Cost_AddInputs */
/** @typedef {{}} Fixed_Cost_AmountInputs */
/** @typedef {{}} Fixed_Cost_Amount_EurInputs */
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
import * as registry from "../registry.js"


export const account_menu_label = /** @type {(inputs: Account_Menu_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.username}'s account, ${i?.status}`)
};

export const account_signed_in_as = /** @type {(inputs: Account_Signed_In_AsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Signed in as ${i?.username}`)
};

export const action_add = /** @type {(inputs: Action_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add`)
};

export const action_back = /** @type {(inputs: Action_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back`)
};

export const action_cancel = /** @type {(inputs: Action_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancel`)
};

export const action_delete = /** @type {(inputs: Action_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete`)
};

export const action_discard = /** @type {(inputs: Action_DiscardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Discard`)
};

export const action_export = /** @type {(inputs: Action_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export`)
};

export const action_import = /** @type {(inputs: Action_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import`)
};

export const action_next = /** @type {(inputs: Action_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next`)
};

export const action_reload = /** @type {(inputs: Action_ReloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reload`)
};

export const action_remove = /** @type {(inputs: Action_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove`)
};

export const action_replace = /** @type {(inputs: Action_ReplaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replace`)
};

export const action_restore = /** @type {(inputs: Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restore`)
};

export const action_retry = /** @type {(inputs: Action_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Try again`)
};

export const action_save = /** @type {(inputs: Action_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save`)
};

export const action_sign_in = /** @type {(inputs: Action_Sign_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in`)
};

export const action_sign_out = /** @type {(inputs: Action_Sign_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign out`)
};

export const action_undo = /** @type {(inputs: Action_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Undo`)
};

export const action_update = /** @type {(inputs: Action_UpdateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Update`)
};

export const api_error_account_not_empty = /** @type {(inputs: Api_Error_Account_Not_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your account already contains data.`)
};

export const api_error_file_too_large = /** @type {(inputs: Api_Error_File_Too_LargeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The file is too large.`)
};

export const api_error_forbidden = /** @type {(inputs: Api_Error_ForbiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You aren't allowed to do that.`)
};

export const api_error_invalid_link = /** @type {(inputs: Api_Error_Invalid_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This link is invalid, has expired or has already been used.`)
};

export const api_error_invalid_request = /** @type {(inputs: Api_Error_Invalid_RequestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The data is invalid.`)
};

export const api_error_not_found = /** @type {(inputs: Api_Error_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not found.`)
};

export const api_error_unauthorized = /** @type {(inputs: Api_Error_UnauthorizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Please sign in again.`)
};

export const api_error_unknown_category = /** @type {(inputs: Api_Error_Unknown_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The category no longer exists.`)
};

export const api_error_unknown_user = /** @type {(inputs: Api_Error_Unknown_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This user doesn't exist.`)
};

export const api_error_username_required = /** @type {(inputs: Api_Error_Username_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Please enter a username.`)
};

export const api_error_username_taken = /** @type {(inputs: Api_Error_Username_TakenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This username is already taken.`)
};

export const app_name = /** @type {(inputs: App_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expense Tracker`)
};

export const auth_password = /** @type {(inputs: Auth_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password`)
};

export const auth_username = /** @type {(inputs: Auth_UsernameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Username`)
};

export const error_try_again = /** @type {(inputs: Error_Try_AgainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`That didn't work. Please try again.`)
};

export const error_unexpected = /** @type {(inputs: Error_UnexpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An unknown error occurred. Please try again.`)
};

export const error_unknown = /** @type {(inputs: Error_UnknownInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unknown error.`)
};

export const fixed_cost_active = /** @type {(inputs: Fixed_Cost_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active`)
};

export const fixed_cost_add = /** @type {(inputs: Fixed_Cost_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add fixed cost`)
};

export const fixed_cost_amount = /** @type {(inputs: Fixed_Cost_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount`)
};

export const fixed_cost_amount_eur = /** @type {(inputs: Fixed_Cost_Amount_EurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount (EUR)`)
};

export const fixed_cost_categories = /** @type {(inputs: Fixed_Cost_CategoriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Categories`)
};

export const fixed_cost_category = /** @type {(inputs: Fixed_Cost_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Category`)
};

export const fixed_cost_choose_category = /** @type {(inputs: Fixed_Cost_Choose_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a category`)
};

export const fixed_cost_choose_start_date = /** @type {(inputs: Fixed_Cost_Choose_Start_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a start date`)
};

export const fixed_cost_created = /** @type {(inputs: Fixed_Cost_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fixed cost “${i?.name}” added`)
};

export const fixed_cost_delete_description = /** @type {(inputs: Fixed_Cost_Delete_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This can't be undone.`)
};

export const fixed_cost_delete_failed = /** @type {(inputs: Fixed_Cost_Delete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The fixed cost couldn't be deleted. Please try again.`)
};

export const fixed_cost_delete_title = /** @type {(inputs: Fixed_Cost_Delete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete fixed cost?`)
};

export const fixed_cost_deleted = /** @type {(inputs: Fixed_Cost_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed cost deleted`)
};

export const fixed_cost_edit = /** @type {(inputs: Fixed_Cost_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit fixed cost`)
};

export const fixed_cost_end_date = /** @type {(inputs: Fixed_Cost_End_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`End date`)
};

export const fixed_cost_end_date_hint = /** @type {(inputs: Fixed_Cost_End_Date_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leave empty for no end date`)
};

export const fixed_cost_end_date_optional = /** @type {(inputs: Fixed_Cost_End_Date_OptionalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`End date (optional)`)
};

export const fixed_cost_interval = /** @type {(inputs: Fixed_Cost_IntervalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Interval`)
};

export const fixed_cost_interval_monthly = /** @type {(inputs: Fixed_Cost_Interval_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Monthly`)
};

export const fixed_cost_interval_quarterly = /** @type {(inputs: Fixed_Cost_Interval_QuarterlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quarterly`)
};

export const fixed_cost_interval_yearly = /** @type {(inputs: Fixed_Cost_Interval_YearlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yearly`)
};

export const fixed_cost_list_empty = /** @type {(inputs: Fixed_Cost_List_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No fixed costs yet.`)
};

export const fixed_cost_monthly_total = /** @type {(inputs: Fixed_Cost_Monthly_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Monthly total`)
};

export const fixed_cost_name = /** @type {(inputs: Fixed_Cost_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name`)
};

export const fixed_cost_name_placeholder = /** @type {(inputs: Fixed_Cost_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e.g. Spotify`)
};

export const fixed_cost_new = /** @type {(inputs: Fixed_Cost_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New fixed cost`)
};

export const fixed_cost_not_found = /** @type {(inputs: Fixed_Cost_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed cost not found.`)
};

export const fixed_cost_per_month = /** @type {(inputs: Fixed_Cost_Per_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`/ month`)
};

export const fixed_cost_save_failed = /** @type {(inputs: Fixed_Cost_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The fixed cost couldn't be saved. Please try again.`)
};

export const fixed_cost_start_date = /** @type {(inputs: Fixed_Cost_Start_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start date`)
};

export const fixed_cost_unknown_category = /** @type {(inputs: Fixed_Cost_Unknown_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unknown`)
};

export const fixed_cost_update_failed = /** @type {(inputs: Fixed_Cost_Update_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The fixed cost couldn't be updated. Please try again.`)
};

export const fixed_cost_updated = /** @type {(inputs: Fixed_Cost_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed cost updated`)
};

export const fixed_costs_title = /** @type {(inputs: Fixed_Costs_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed costs`)
};

export const kind_expense = /** @type {(inputs: Kind_ExpenseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expense`)
};

export const kind_income = /** @type {(inputs: Kind_IncomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Income`)
};

export const link_create_account = /** @type {(inputs: Link_Create_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create account`)
};

export const link_for_user = /** @type {(inputs: Link_For_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`For`)
};

export const link_invalid = /** @type {(inputs: Link_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This link is invalid, has expired or has already been used. Please ask for a new one.`)
};

export const link_min_password_length = /** @type {(inputs: Link_Min_Password_LengthInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`At least ${i?.count} characters`)
};

export const link_password_changed = /** @type {(inputs: Link_Password_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password changed`)
};

export const link_password_saved_sign_in = /** @type {(inputs: Link_Password_Saved_Sign_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password saved. Please sign in.`)
};

export const link_passwords_differ = /** @type {(inputs: Link_Passwords_DifferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The passwords don't match.`)
};

export const link_repeat_password = /** @type {(inputs: Link_Repeat_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Repeat password`)
};

export const link_set_new_password = /** @type {(inputs: Link_Set_New_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set a new password`)
};

export const link_title = /** @type {(inputs: Link_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Link`)
};

export const link_username_rules = /** @type {(inputs: Link_Username_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Username: 3–30 characters (letters, digits, _ and .).`)
};

export const link_welcome = /** @type {(inputs: Link_WelcomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Welcome!`)
};

export const login_failed = /** @type {(inputs: Login_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign-in failed. Please try again.`)
};

export const login_wrong_credentials = /** @type {(inputs: Login_Wrong_CredentialsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wrong username or password.`)
};

export const month_choose = /** @type {(inputs: Month_ChooseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose month`)
};

export const month_next = /** @type {(inputs: Month_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next month`)
};

export const month_next_year = /** @type {(inputs: Month_Next_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next year`)
};

export const month_previous = /** @type {(inputs: Month_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous month`)
};

export const month_previous_year = /** @type {(inputs: Month_Previous_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous year`)
};

export const nav_label = /** @type {(inputs: Nav_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Main navigation`)
};

export const nav_overview = /** @type {(inputs: Nav_OverviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Overview`)
};

export const nav_transactions = /** @type {(inputs: Nav_TransactionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Transactions`)
};

export const offline_unavailable = /** @type {(inputs: Offline_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not available offline`)
};

export const overview_categories_empty = /** @type {(inputs: Overview_Categories_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No spending this month`)
};

export const overview_categories_hint = /** @type {(inputs: Overview_Categories_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Line: typical month`)
};

export const overview_categories_title = /** @type {(inputs: Overview_Categories_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Categories`)
};

export const overview_exceptional = /** @type {(inputs: Overview_ExceptionalInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Incl. ${i?.count} exceptional transaction: ${i?.amount}`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Incl. ${i?.count} exceptional transactions: ${i?.amount}`);
	return /** @type {LocalizedString} */ ("overview_exceptional");
};

export const overview_expenses = /** @type {(inputs: Overview_ExpensesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expenses`)
};

export const overview_fixed_costs = /** @type {(inputs: Overview_Fixed_CostsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`+ Fixed costs`)
};

export const overview_income = /** @type {(inputs: Overview_IncomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Income`)
};

export const overview_net_spending = /** @type {(inputs: Overview_Net_SpendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Net spending`)
};

export const overview_pace_above_day = /** @type {(inputs: Overview_Pace_Above_DayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.percent} above a typical month by day ${i?.day}`)
};

export const overview_pace_above_month = /** @type {(inputs: Overview_Pace_Above_MonthInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.percent} above a typical month`)
};

export const overview_pace_below_day = /** @type {(inputs: Overview_Pace_Below_DayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.percent} below a typical month by day ${i?.day}`)
};

export const overview_pace_below_month = /** @type {(inputs: Overview_Pace_Below_MonthInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.percent} below a typical month`)
};

export const overview_pace_even = /** @type {(inputs: Overview_Pace_EvenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Like a typical month`)
};

export const overview_pace_none = /** @type {(inputs: Overview_Pace_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not enough history for a typical month yet`)
};

export const overview_total_outflow = /** @type {(inputs: Overview_Total_OutflowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`= Total outflow`)
};

export const overview_trend_hint = /** @type {(inputs: Overview_Trend_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Net spending without exceptional transactions`)
};

export const overview_trend_title = /** @type {(inputs: Overview_Trend_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last 12 months`)
};

export const overview_vs_typical = /** @type {(inputs: Overview_Vs_TypicalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.change} vs. typical`)
};

export const page_title = /** @type {(inputs: Page_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.page} · Expense Tracker`)
};

export const pattern_drift = /** @type {(inputs: Pattern_DriftInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.category}: ${i?.change} per day vs. the 3 months before`)
};

export const pattern_recurring = /** @type {(inputs: Pattern_RecurringInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}: ${i?.count}× in 3 months, ⌀ ${i?.average}`)
};

export const pattern_rhythm = /** @type {(inputs: Pattern_RhythmInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.share} of ${i?.category} spending falls on ${i?.first}–${i?.last}`)
};

export const pattern_small = /** @type {(inputs: Pattern_SmallInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} purchases under ${i?.limit} add up to ${i?.total}`)
};

export const pattern_small_top = /** @type {(inputs: Pattern_Small_TopInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} purchases under ${i?.limit} add up to ${i?.total}, many at ${i?.name}`)
};

export const patterns_hint = /** @type {(inputs: Patterns_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last 3 months, without exceptional transactions`)
};

export const patterns_title = /** @type {(inputs: Patterns_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Patterns`)
};

export const period = /** @type {(inputs: PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period`)
};

export const period_any = /** @type {(inputs: Period_AnyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Any time`)
};

export const period_choose_search = /** @type {(inputs: Period_Choose_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose the period to search`)
};

export const period_custom = /** @type {(inputs: Period_CustomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Custom period`)
};

export const period_older_than_half_year = /** @type {(inputs: Period_Older_Than_Half_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Older than 6 months`)
};

export const period_older_than_month = /** @type {(inputs: Period_Older_Than_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Older than a month`)
};

export const period_older_than_week = /** @type {(inputs: Period_Older_Than_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Older than a week`)
};

export const period_older_than_year = /** @type {(inputs: Period_Older_Than_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Older than a year`)
};

export const pwa_offline_ready = /** @type {(inputs: Pwa_Offline_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ready to work offline`)
};

export const pwa_update_available = /** @type {(inputs: Pwa_Update_AvailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A new version is available. Reload to update.`)
};

export const pwa_wait_for_sync = /** @type {(inputs: Pwa_Wait_For_SyncInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Please wait until all changes are synced.`)
};

export const sankey_amount_placeholder = /** @type {(inputs: Sankey_Amount_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount`)
};

export const sankey_description = /** @type {(inputs: Sankey_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter the month and year to export, along with income sources and fixed costs.`)
};

export const sankey_income_source_placeholder = /** @type {(inputs: Sankey_Income_Source_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name (e.g., job)`)
};

export const sankey_income_sources = /** @type {(inputs: Sankey_Income_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Income Sources`)
};

export const sankey_invalid_month = /** @type {(inputs: Sankey_Invalid_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Please enter a valid month (1-12) and year`)
};

export const sankey_load_failed = /** @type {(inputs: Sankey_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not load the data for the export`)
};

export const sankey_month = /** @type {(inputs: Sankey_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Month (1-12)`)
};

export const sankey_month_placeholder = /** @type {(inputs: Sankey_Month_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e.g., 11`)
};

export const sankey_open = /** @type {(inputs: Sankey_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Summarize`)
};

export const sankey_savings_target_placeholder = /** @type {(inputs: Sankey_Savings_Target_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name (e.g., bitcoin)`)
};

export const sankey_savings_targets = /** @type {(inputs: Sankey_Savings_TargetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Savings Targets`)
};

export const sankey_title = /** @type {(inputs: Sankey_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export Month as Sankey Diagram`)
};

export const sankey_year = /** @type {(inputs: Sankey_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Year`)
};

export const sankey_year_placeholder = /** @type {(inputs: Sankey_Year_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e.g., 2025`)
};

export const search_all_months = /** @type {(inputs: Search_All_MonthsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Results from all months`)
};

export const search_clear = /** @type {(inputs: Search_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear search`)
};

export const search_label = /** @type {(inputs: Search_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search`)
};

export const search_load_more = /** @type {(inputs: Search_Load_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Load more`)
};

export const search_no_results = /** @type {(inputs: Search_No_ResultsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No results`)
};

export const search_offline = /** @type {(inputs: Search_OfflineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search isn't available offline.`)
};

export const search_placeholder = /** @type {(inputs: Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search transactions`)
};

export const settings_export_description = /** @type {(inputs: Settings_Export_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Download all your transactions, categories and fixed costs as a file. You can import it into a new account later.`)
};

export const settings_export_failed = /** @type {(inputs: Settings_Export_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The export failed.`)
};

export const settings_import_description = /** @type {(inputs: Settings_Import_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import an export. This replaces your categories. If your account already has transactions or fixed costs, you can replace everything with the file.`)
};

export const settings_import_failed = /** @type {(inputs: Settings_Import_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The import failed. Please try again.`)
};

export const settings_import_invalid_file = /** @type {(inputs: Settings_Import_Invalid_FileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The file is not a valid backup.`)
};

export const settings_import_invalid_file_detail = /** @type {(inputs: Settings_Import_Invalid_File_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The file is not a valid backup (${i?.issue}).`)
};

export const settings_import_replace_description = /** @type {(inputs: Settings_Import_Replace_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your account already contains data. The import deletes all transactions, fixed costs and categories and replaces them with those from the file. This can't be undone; export first if you want to keep your current data.`)
};

export const settings_import_replace_title = /** @type {(inputs: Settings_Import_Replace_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replace all data?`)
};

export const settings_import_success = /** @type {(inputs: Settings_Import_SuccessInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Imported. Transactions: ${i?.transactions}, fixed costs: ${i?.fixedCosts}.`)
};

export const settings_language = /** @type {(inputs: Settings_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language`)
};

export const settings_language_description = /** @type {(inputs: Settings_Language_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Applies to this device only.`)
};

export const settings_title = /** @type {(inputs: Settings_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settings`)
};

export const sign_out_anyway_title = /** @type {(inputs: Sign_Out_Anyway_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign out anyway?`)
};

export const sign_out_failed = /** @type {(inputs: Sign_Out_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign-out failed. Please try again.`)
};

export const sign_out_unsynced_changes = /** @type {(inputs: Sign_Out_Unsynced_ChangesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} change hasn't been synced yet and will be lost when you sign out.`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} changes haven't been synced yet and will be lost when you sign out.`);
	return /** @type {LocalizedString} */ ("sign_out_unsynced_changes");
};

export const sync_action_deleted = /** @type {(inputs: Sync_Action_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deleted`)
};

export const sync_action_saved = /** @type {(inputs: Sync_Action_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saved`)
};

export const sync_later_hint = /** @type {(inputs: Sync_Later_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`will sync once you're online`)
};

export const sync_menu_failed = /** @type {(inputs: Sync_Menu_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} rejected`)
};

export const sync_menu_offline = /** @type {(inputs: Sync_Menu_OfflineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Offline`)
};

export const sync_menu_offline_pending = /** @type {(inputs: Sync_Menu_Offline_PendingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Offline · ${i?.count} pending`)
};

export const sync_menu_pending = /** @type {(inputs: Sync_Menu_PendingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} pending`)
};

export const sync_menu_synced = /** @type {(inputs: Sync_Menu_SyncedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All synced`)
};

export const sync_not_synced_yet = /** @type {(inputs: Sync_Not_Synced_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not synced yet`)
};

export const sync_now = /** @type {(inputs: Sync_NowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sync now`)
};

export const sync_pending = /** @type {(inputs: Sync_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pending`)
};

export const sync_rejected = /** @type {(inputs: Sync_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rejected`)
};

export const sync_rejected_status = /** @type {(inputs: Sync_Rejected_StatusInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The server rejected the change (${i?.status}).`)
};

export const sync_server_unreachable = /** @type {(inputs: Sync_Server_UnreachableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The server can't be reached right now.`)
};

export const sync_status_failed = /** @type {(inputs: Sync_Status_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Some changes were rejected.`)
};

export const sync_status_offline = /** @type {(inputs: Sync_Status_OfflineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Offline – changes will be sent later.`)
};

export const sync_status_pending = /** @type {(inputs: Sync_Status_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Syncing …`)
};

export const sync_status_synced = /** @type {(inputs: Sync_Status_SyncedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All synced.`)
};

export const sync_title = /** @type {(inputs: Sync_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sync`)
};

export const transaction_amount = /** @type {(inputs: Transaction_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount`)
};

export const transaction_amount_last = /** @type {(inputs: Transaction_Amount_LastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Same as last time: ${i?.amount}`)
};

export const transaction_amount_missing = /** @type {(inputs: Transaction_Amount_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter an amount.`)
};

export const transaction_category = /** @type {(inputs: Transaction_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Category`)
};

export const transaction_category_missing = /** @type {(inputs: Transaction_Category_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a category.`)
};

export const transaction_choose_date = /** @type {(inputs: Transaction_Choose_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose date`)
};

export const transaction_counterparty_aliased = /** @type {(inputs: Transaction_Counterparty_AliasedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`From “${i?.raw}”`)
};

export const transaction_counterparty_expense = /** @type {(inputs: Transaction_Counterparty_ExpenseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Where?`)
};

export const transaction_counterparty_income = /** @type {(inputs: Transaction_Counterparty_IncomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From whom?`)
};

export const transaction_counterparty_missing = /** @type {(inputs: Transaction_Counterparty_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter where or from whom.`)
};

export const transaction_counterparty_use = /** @type {(inputs: Transaction_Counterparty_UseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Use “${i?.name}”`)
};

export const transaction_date = /** @type {(inputs: Transaction_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date`)
};

export const transaction_date_today = /** @type {(inputs: Transaction_Date_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Today`)
};

export const transaction_date_yesterday = /** @type {(inputs: Transaction_Date_YesterdayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yesterday`)
};

export const transaction_delete_description = /** @type {(inputs: Transaction_Delete_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This can't be undone. The transaction will be removed from the history.`)
};

export const transaction_delete_title = /** @type {(inputs: Transaction_Delete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete transaction?`)
};

export const transaction_description = /** @type {(inputs: Transaction_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Description`)
};

export const transaction_edit = /** @type {(inputs: Transaction_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit transaction`)
};

export const transaction_exceptional = /** @type {(inputs: Transaction_ExceptionalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exceptional`)
};

export const transaction_expense_deleted = /** @type {(inputs: Transaction_Expense_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The expense was deleted.`)
};

export const transaction_expense_saved = /** @type {(inputs: Transaction_Expense_SavedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Expense at ${i?.name} saved`)
};

export const transaction_expenses_saved = /** @type {(inputs: Transaction_Expenses_SavedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} expenses at ${i?.name} saved`)
};

export const transaction_fab = /** @type {(inputs: Transaction_FabInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Track`)
};

export const transaction_filter = /** @type {(inputs: Transaction_FilterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filter by category`)
};

export const transaction_filter_active = /** @type {(inputs: Transaction_Filter_ActiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Category filter active: ${i?.category}`)
};

export const transaction_filter_all = /** @type {(inputs: Transaction_Filter_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All categories`)
};

export const transaction_income_deleted = /** @type {(inputs: Transaction_Income_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The income was deleted.`)
};

export const transaction_income_saved = /** @type {(inputs: Transaction_Income_SavedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Income from ${i?.name} saved`)
};

export const transaction_incomes_saved = /** @type {(inputs: Transaction_Incomes_SavedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} incomes from ${i?.name} saved`)
};

export const transaction_list_empty = /** @type {(inputs: Transaction_List_EmptyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No transactions (${i?.period})`)
};

export const transaction_list_loading = /** @type {(inputs: Transaction_List_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading transactions`)
};

export const transaction_list_offline = /** @type {(inputs: Transaction_List_OfflineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Offline – this month hasn't been loaded yet`)
};

export const transaction_list_upcoming = /** @type {(inputs: Transaction_List_UpcomingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Upcoming`)
};

export const transaction_more = /** @type {(inputs: Transaction_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`More details`)
};

export const transaction_new = /** @type {(inputs: Transaction_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New transaction`)
};

export const transaction_no_description = /** @type {(inputs: Transaction_No_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No description`)
};

export const transaction_not_found = /** @type {(inputs: Transaction_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Transaction not found.`)
};

export const transaction_split = /** @type {(inputs: Transaction_SplitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Split`)
};

export const transaction_split_description = /** @type {(inputs: Transaction_Split_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Description (optional)`)
};

export const transaction_split_remainder = /** @type {(inputs: Transaction_Split_RemainderInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Stays in ${i?.category}: ${i?.amount}`)
};

export const transaction_split_remainder_uncategorized = /** @type {(inputs: Transaction_Split_Remainder_UncategorizedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Stays in the main category: ${i?.amount}`)
};

export const transaction_split_remove = /** @type {(inputs: Transaction_Split_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove part`)
};

export const transaction_split_too_much = /** @type {(inputs: Transaction_Split_Too_MuchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing is left for the main category. Remove a part or lower its amount.`)
};

export const transaction_updated = /** @type {(inputs: Transaction_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Transaction updated`)
};