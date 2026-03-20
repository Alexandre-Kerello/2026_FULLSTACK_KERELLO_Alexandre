function errorHandler(err, req, res, next) 
{
    if (err.name === "ValidationError") 
    {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: 'Invalid data', errors: messages });
    }
    
    if (err.code == 11000) 
    {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ message: `Duplicate value for field: ${field}` });
    }

    if (err.name === "CastError") 
        return res.status(400).json({ message: `Invalid ID format: ${err.value}` });

    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    if (status === 500 ) 
        console.error('[ErrorHandler]', err);

    return res.status(status).json({ message });
}

export { errorHandler };