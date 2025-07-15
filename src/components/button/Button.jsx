function Button({ href = '#', title = 'Buton' }) {
    return (
        <div className="btn-wrapper">
            <a href={href} className="btn btn-lg btn-primary">
                {title}
            </a>
        </div>
    );
}

export default Button;
