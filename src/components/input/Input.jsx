function Input({
    label,
    type = 'text',
    required = false,
    name,
    hasMarginBottom = false,
    onChange = () => {},
    inputMode = 'text',
    value = undefined,
}) {
    return (
        <div style={{ marginBottom: hasMarginBottom ? '16px' : '0' }}>
            <label>
                <span>
                    {label} {required && <span className="required">*</span>}
                </span>
                <input
                    style={{ width: '100%' }}
                    name={name}
                    type={type}
                    required={required}
                    onChange={onChange}
                    inputMode={inputMode}
                    {...(value !== undefined ? { value } : {})}
                />
            </label>
        </div>
    );
}

export default Input;
